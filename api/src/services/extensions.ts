import config from '../config';
import logger from '../helpers/logger';
import { callApi } from '../helpers/apiCaller';
import {
  determineRequestType,
  buildExtensionFilter,
  getAppConfig as getLokiAppConfig,
  buildOrgFilter,
  parseSearchInput,
  buildLokiQuery,
  toLokiNanos,
  convertLog,
  LokiQueryResponse,
} from '../helpers/loki';
import { getMySQLPool } from '../loaders/mysql';
import mongoose from 'mongoose';
import {
  IN_PROGRESS,
  SLAVE_APITESTER,
  CAPILLARY_NPM_PREFIX,
  GITHUB_API_BASE,
  EXTENSIONS_REPO_OWNER,
  GITHUB_ACCEPT_HEADER,
  HEALTHCARE_FRONTEND_PACKAGE,
  HEALTHCARE_FRONTEND_REPO,
  HEALTHCARE_LOYALTYWARE_REPO,
  HEALTHCARE_LOYALTYWARE_PACKAGES,
  GITHUB_BRANCHES_PER_PAGE,
  BRANCH_EXCLUDE_PREFIXES,
  BUILD_POLL_MAX_RETRIES,
  BUILD_POLL_INTERVAL_MS,
  DEVCONSOLE_USER_AGENT,
  ORG_HIERARCHY_PATH,
  ORG_EXTENSIONS_GROUPINGS_PATH,
  SLAVE_EXTENSION_HELPER_PATH,
  LOKI_DEFAULT_LIMIT,
  DEFAULT_USER_TIMEZONE,
  buildExtensionJobConfigXml,
  GRAFANA_APP_NAME_FOR_EXTENSION,
  getNewRelicAppConfigs,
} from '../constants/constants';
import {
  ExtensionGitMetaData,
  ExtensionBuildRecord,
} from '../types/extensions';

const githubHeaders = () => ({
  Authorization: `token ${config.GITHUB_TOKEN}`,
  Accept: GITHUB_ACCEPT_HEADER,
});

const intouchHeaders = (orgId: number | string) => ({
  'X-CAP-API-AUTH-KEY': config.INTOUCH_INTERNAL_API_KEY,
  'X-CAP-API-AUTH-ORG-ID': String(orgId),
  'User-Agent': DEVCONSOLE_USER_AGENT,
});

const jenkinsAuthHeader = () => ({ Authorization: config.JENKINS_AUTH ?? '' });

const jenkinsBasicAuth = () =>
  'Basic ' +
  Buffer.from(`${config.JENKINS_USER}:${config.JENKINS_API_TOKEN}`).toString(
    'base64',
  );

const jenkinsBaseUrl = () => `http://${config.JENKINS_URL}`;

const githubRepoApi = (repo: string) =>
  `${GITHUB_API_BASE}/repos/${EXTENSIONS_REPO_OWNER}/${repo}`;

const stripPackagePrefix = (packageName: string) =>
  packageName.replace(CAPILLARY_NPM_PREFIX, '');

const resolveRepoName = (packageName: string) => {
  if (packageName === HEALTHCARE_FRONTEND_PACKAGE) {
    return HEALTHCARE_FRONTEND_REPO;
  }
  if (HEALTHCARE_LOYALTYWARE_PACKAGES.has(packageName)) {
    return HEALTHCARE_LOYALTYWARE_REPO;
  }
  return stripPackagePrefix(packageName);
};

const parseGithubRepo = (githubUrl: string) => {
  const match = githubUrl.match(/github\.com[/:]([^/]+)\/([^/.]+)/);
  return match ? { owner: match[1], repo: match[2] } : null;
};

const callInternalApi = async (orgId: number) => {
  const url = `${config.INTOUCH_INTERNAL_API_URL}${ORG_HIERARCHY_PATH}/${orgId}/hierarchy`;
  try {
    return await callApi({ url, headers: intouchHeaders(orgId) });
  } catch (error) {
    logger.error(
      `callInternalApi: org ${orgId} failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
    throw error;
  }
};

const getParentOrgId = async (orgId: number) => {
  logger.info(`getParentOrgId: resolving for org ${orgId}`);
  try {
    const response = await callInternalApi(orgId);
    const hierarchyData = response.data as Record<string, any>;

    const baseOrg = hierarchyData.baseOrganization || {};
    if (baseOrg.orgType === 'SUPER_ORG' || baseOrg.orgType === 'STANDARD_ORG') {
      return orgId;
    }
    const connectedOrgs: Array<Record<string, any>> =
      hierarchyData.connectedOrganizations || [];
    const superOrg = connectedOrgs.find((o) => o.orgType === 'SUPER_ORG');
    return superOrg?.id ?? orgId;
  } catch {
    logger.error(`getParentOrgId: failed for org ${orgId}`);
  }
};

const fetchOrgExtensionsFromIntouch = async (orgId: number) => {
  logger.info(`fetchOrgExtensionsFromIntouch: org ${orgId}`);
  try {
    const parentOrgId = await getParentOrgId(orgId);
    logger.info(`fetchOrgExtensionsFromIntouch: parent org ${parentOrgId}`);

    const url = `${config.ORG_SETTINGS_SERVICE_HOST}${ORG_EXTENSIONS_GROUPINGS_PATH}`;
    const response = await callApi({
      url,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.INTOUCH_INTERNAL_API_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': DEVCONSOLE_USER_AGENT,
      },
      body: { fullSet: false, orgs: [String(parentOrgId)] },
    });
    const data = response.data as Record<string, any>;
    return data.result[String(parentOrgId)];
  } catch {
    logger.error(`fetchOrgExtensionsFromIntouch: failed for org ${orgId}`);
    return null;
  }
};

const syncDeploymentStatusFromJenkins = async (extensionList: string[]) => {
  const mySqlPool = getMySQLPool();
  const [buildRows] = await mySqlPool.query(
    'SELECT depId, jobName FROM extensions_deployment WHERE status=? AND extensionName IN (?)',
    [IN_PROGRESS, extensionList],
  );

  for (const row of buildRows as any[]) {
    const id = row?.depId;
    const jenkinsJobName = row?.jobName;
    if (!id || !jenkinsJobName) {
      logger.warn(
        `syncDeploymentStatusFromJenkins: skipping row depId=${id} jobName=${jenkinsJobName}`,
      );
      continue;
    }

    try {
      const url = `${jenkinsBaseUrl()}/job/${jenkinsJobName}/${id}/api/json`;
      const response = await callApi<{ result?: string; inProgress?: boolean }>(
        { url, headers: jenkinsAuthHeader() },
      );

      if (!response.success) {
        logger.warn(
          `syncDeploymentStatusFromJenkins: Jenkins ${response.status} for depId=${id}`,
        );
        continue;
      }

      if (!(response.data?.inProgress ?? false)) {
        await mySqlPool.query(
          'UPDATE extensions_deployment SET status=? WHERE depId=? AND jobName=?',
          [response.data?.result ?? 'UNKNOWN', id, jenkinsJobName],
        );
      }
    } catch (err) {
      logger.error(
        `syncDeploymentStatusFromJenkins: depId=${id} failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
      );
    }
  }
};

export const getExtensionsBuildHistory = async (orgId: number) => {
  logger.info(`getExtensionsBuildHistory: org ${orgId}`);
  let extensionList: string[] = [];
  try {
    const orgExtensions = await fetchOrgExtensionsFromIntouch(orgId);
    extensionList = (orgExtensions || [])
      .map((ext: any) => ext?.packageName)
      .filter((name: string | undefined): name is string => Boolean(name));

    if (extensionList.length === 0) return [];

    const mySqlPool = getMySQLPool();
    const [rows] = await mySqlPool.query(
      'SELECT depId, extensionName, branchOrTag, status, version, description, triggeredBy, auto_update_time FROM extensions_deployment WHERE extensionName IN (?) ORDER BY auto_update_time DESC',
      [extensionList],
    );
    return rows;
  } catch (error) {
    logger.error(
      `getExtensionsBuildHistory: org ${orgId} failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
    return null;
  } finally {
    if (extensionList.length > 0) {
      syncDeploymentStatusFromJenkins(extensionList).catch((e) =>
        logger.error(
          `syncDeploymentStatusFromJenkins: org ${orgId} failed: ${e instanceof Error ? e.message : 'Unknown error'}`,
        ),
      );
    }
  }
};

export const getExtensionsBuildLogs = async (
  buildId: number,
  extensionName: string,
) => {
  const mySqlPool = getMySQLPool();
  const [rows] = await mySqlPool.query(
    'SELECT jobName FROM extensions_deployment_metadata WHERE extensionName=?',
    [extensionName],
  );
  const jobName = (rows as any[])?.[0]?.jobName;
  logger.info(`getExtensionsBuildLogs: jobName=${jobName}`);
  const url = `${jenkinsBaseUrl()}/job/${jobName}/${buildId}/consoleText`;
  return callApi({ url, headers: jenkinsAuthHeader() });
};

const getRepoLink = async (
  packageName: string,
  orgId: number,
  userId: number,
) => {
  if (packageName === HEALTHCARE_FRONTEND_PACKAGE) {
    return `https://github.com/${EXTENSIONS_REPO_OWNER}/${HEALTHCARE_FRONTEND_REPO}`;
  }
  const cluster = config?.CLUSTER?.toLowerCase();
  const apitesterBase = SLAVE_APITESTER[cluster];
  if (!apitesterBase) {
    logger.error(
      `getRepoLink: no SLAVE_APITESTER entry for cluster '${cluster}'`,
    );
    return '';
  }
  const response = await callApi<string>({
    url: apitesterBase + SLAVE_EXTENSION_HELPER_PATH,
    method: 'POST',
    headers: { Authorization: config?.SLAVE_APITESTER_KEY },
    body: {
      payload: JSON.stringify({
        orgid: String(orgId),
        cluster,
        executor: 'repoLink',
        packageName,
      }),
      user: String(userId),
    },
  });
  return response?.data ?? '';
};

const getRepoinfo = async (packageName: string) => {
  const repo = resolveRepoName(packageName);
  const headers = githubHeaders();

  const repoResponse = await callApi<{ default_branch?: string }>({
    url: githubRepoApi(repo),
    headers,
  });
  if (!repoResponse.success) {
    logger.error(
      `getRepoinfo: repo ${repo} fetch failed (${repoResponse.status})`,
    );
    throw new Error('Error fetching repository details');
  }
  const defaultBranch = repoResponse.data?.default_branch;

  const branchesUrl = `${githubRepoApi(repo)}/branches`;
  const allBranchNames = new Set<string>();
  for (let page = 1; ; page++) {
    const branchesResponse = await callApi<Array<{ name: string }>>({
      url: `${branchesUrl}?page=${page}&per_page=${GITHUB_BRANCHES_PER_PAGE}`,
      headers,
    });
    if (!branchesResponse.success) {
      logger.error(
        `getRepoinfo: branches fetch failed for ${repo} (${branchesResponse.status})`,
      );
      break;
    }
    const branchesData = branchesResponse.data ?? [];
    if (branchesData.length === 0) break;

    for (const { name } of branchesData) {
      if (!BRANCH_EXCLUDE_PREFIXES.some((p) => name.startsWith(p))) {
        allBranchNames.add(name);
      }
    }
  }

  const branches: string[] = [];
  if (defaultBranch && allBranchNames.has(defaultBranch)) {
    branches.push(defaultBranch);
    allBranchNames.delete(defaultBranch);
  }
  branches.push(...Array.from(allBranchNames).sort());

  const tagsResponse = await callApi<Array<{ name: string }>>({
    url: `${githubRepoApi(repo)}/tags`,
    headers,
  });
  const tags = tagsResponse.success
    ? (tagsResponse.data ?? [])
        .map((t) => t?.name)
        .filter((n): n is string => Boolean(n))
    : [];

  return { branches, tags };
};

export const getExtensionsBuildMetaData = async (
  orgId: number,
  userId: number,
) => {
  const orgExtensions = (await fetchOrgExtensionsFromIntouch(orgId)) || [];
  return Promise.all(
    orgExtensions.map(async (ext: any) => {
      const packageName = ext?.packageName;
      const [repoLink, info] = await Promise.all([
        getRepoLink(packageName, orgId, userId).catch(() => null),
        getRepoinfo(packageName).catch((err) => {
          logger.error(
            `getExtensionsBuildMetaData: getRepoinfo failed for ${packageName}: ${err instanceof Error ? err.message : 'Unknown error'}`,
          );
          return { branches: [], tags: [] };
        }),
      ]);
      return {
        extensionId: ext?.extensionId,
        packageName,
        envType: ext?.envType,
        version: ext?.version,
        serviceName: ext?.serviceName,
        url: ext?.url,
        repoLink,
        branches: info.branches,
        tags: info.tags,
      };
    }),
  );
};

const getJenkinsCrumb = async () => {
  const auth = jenkinsBasicAuth();
  const response = await callApi<{
    crumb: string;
    crumbRequestField: string;
  }>({
    url: `${jenkinsBaseUrl()}/crumbIssuer/api/json`,
    headers: { Authorization: auth },
  });
  if (!response.success) {
    throw new Error(`Failed to get Jenkins crumb: ${response.status}`);
  }
  return {
    crumb: response.data.crumb,
    crumbField: response.data.crumbRequestField,
    auth,
  };
};

const createJenkinsJob = async (jobName: string, jobConfigXml: string) => {
  const { crumb, crumbField, auth } = await getJenkinsCrumb();
  return fetch(
    `${jenkinsBaseUrl()}/createItem?name=${encodeURIComponent(jobName)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
        Authorization: auth,
        [crumbField]: crumb,
      },
      body: jobConfigXml,
    },
  );
};

const fetchVersionFromBranch = async (
  githubUrl: string,
  branchOrTag: string,
) => {
  const parsed = parseGithubRepo(githubUrl);
  if (!parsed) return null;
  const { owner, repo } = parsed;
  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/package.json?ref=${encodeURIComponent(branchOrTag)}`;
  try {
    const response = await callApi<{ content?: string }>({
      url,
      headers: githubHeaders(),
    });
    if (!response.success || !response.data?.content) {
      logger.warn(
        `fetchVersionFromBranch: github ${response.status} for ${owner}/${repo}@${branchOrTag}`,
      );
      return null;
    }
    const decoded = Buffer.from(response.data.content, 'base64').toString(
      'utf-8',
    );
    return JSON.parse(decoded).version ?? null;
  } catch (err) {
    logger.error(
      `fetchVersionFromBranch: failed for ${owner}/${repo}@${branchOrTag}: ${err instanceof Error ? err.message : 'Unknown error'}`,
    );
    return null;
  }
};

const ensureJenkinsJob = async (
  extensionName: string,
  tempExtName: string,
  gitRepo: string,
  username: string,
) => {
  const mySqlPool = getMySQLPool();
  const [metaRows] = await mySqlPool.query(
    'SELECT 1 FROM extensions_deployment_metadata WHERE extensionName=?',
    [extensionName],
  );
  if ((metaRows as any[]).length > 0) return;

  const xml = buildExtensionJobConfigXml(extensionName, tempExtName);
  const createResp = await createJenkinsJob(tempExtName, xml);
  if (createResp.status !== 200) {
    logger.error(
      `ensureJenkinsJob: create failed status=${createResp.status} for ${extensionName}`,
    );
    throw new Error('Failed to create Jenkins job, please try after sometime.');
  }
  logger.info(`ensureJenkinsJob: created job ${tempExtName}`);
  await mySqlPool.query(
    'INSERT INTO extensions_deployment_metadata (extensionName, git_repo, jobName, triggeredBy, clusters) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE git_repo=?',
    [extensionName, gitRepo, tempExtName, username, '', gitRepo],
  );
};

const triggerJenkinsBuild = async (
  jobName: string,
  branchOrTag: string,
  gitRepo: string,
) => {
  const params = new URLSearchParams({
    BRANCH_NAME: branchOrTag,
    RESULT_CLUSTER: config.CLUSTER,
    REPO_URL: gitRepo,
  });
  const url = `${jenkinsBaseUrl()}/job/${jobName}/buildWithParameters?${params.toString()}`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: jenkinsAuthHeader(),
  });
  if (resp.status !== 201) {
    logger.error(
      `triggerJenkinsBuild: status=${resp.status} for job ${jobName}`,
    );
    throw new Error('Failed to trigger build, please try after sometime.');
  }
  const location = resp.headers.get('location');
  if (!location) {
    throw new Error('Jenkins did not return a queue location header.');
  }
  return location;
};

const pollQueuedBuildId = async (locationUrl: string) => {
  const statusUrl = `${locationUrl.replace(/\/$/, '')}/api/json`;
  for (let attempt = 1; attempt <= BUILD_POLL_MAX_RETRIES; attempt++) {
    await new Promise((r) => setTimeout(r, BUILD_POLL_INTERVAL_MS));
    const resp = await callApi<{
      why?: string | null;
      executable?: { number: number };
    }>({ url: statusUrl, headers: jenkinsAuthHeader() });

    if (!resp.success) {
      logger.warn(
        `pollQueuedBuildId: attempt ${attempt}/${BUILD_POLL_MAX_RETRIES} status=${resp.status}`,
      );
      continue;
    }
    if (resp.data?.why == null && resp.data?.executable) {
      return resp.data.executable.number;
    }
    logger.info(
      `pollQueuedBuildId: attempt ${attempt}/${BUILD_POLL_MAX_RETRIES} still queued`,
    );
  }
  throw new Error('Failed to fetch build status, max retry exceeded.');
};

export const extensionsTriggerBuild = async (
  orgId: number,
  userId: number,
  gitMetaData: ExtensionGitMetaData,
): Promise<ExtensionBuildRecord> => {
  const {
    description,
    extensionName,
    githubUrl,
    branchOrTag,
    username = String(userId),
  } = gitMetaData ?? ({} as ExtensionGitMetaData);

  if (!extensionName || !githubUrl || !branchOrTag) {
    throw new Error(
      'extensionsTriggerBuild: extensionName, githubUrl and branchOrTag are required',
    );
  }

  const tempExtName = stripPackagePrefix(extensionName);
  const gitRepo = `${githubUrl}.git`;

  const version = await fetchVersionFromBranch(githubUrl, branchOrTag);
  await ensureJenkinsJob(extensionName, tempExtName, gitRepo, username);
  const locationUrl = await triggerJenkinsBuild(
    tempExtName,
    branchOrTag,
    gitRepo,
  );
  const buildId = await pollQueuedBuildId(locationUrl);

  const newBuild: ExtensionBuildRecord = {
    id: buildId,
    extensionName,
    branchOrTag,
    status: IN_PROGRESS,
    version,
    description,
    triggeredBy: username,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    logs: '',
  };

  const mySqlPool = getMySQLPool();
  await mySqlPool.query(
    'INSERT INTO extensions_deployment (triggeredBy, orgId, depId, description, status, jobName, extensionName, branchOrTag, version) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      username,
      orgId,
      buildId,
      description,
      IN_PROGRESS,
      tempExtName,
      extensionName,
      branchOrTag,
      version,
    ],
  );
  logger.info(
    `extensionsTriggerBuild: build triggered ${JSON.stringify(newBuild)}`,
  );
  return newBuild;
};


export const getExtensionLists = async (orgId: number) => {
  const extensions = await fetchOrgExtensionsFromIntouch(orgId);
  for (const ext of extensions || []) {
    GRAFANA_APP_NAME_FOR_EXTENSION[ext.packageName] = ext.packageName;
  }
  return GRAFANA_APP_NAME_FOR_EXTENSION;
};

export const getAppConfig = (appName: string, orgId: number, cluster: string) => {
  const { appConfigs, defaultConfig } = getNewRelicAppConfigs(appName, orgId, cluster);
  const normalizedAppName = appName.toLowerCase();
  const clusterPrefix = cluster.toLowerCase();
  const matchedKey = Object.keys(appConfigs).find((key) => {
    const stripped = key.toLowerCase()
      .replace(`${clusterPrefix}.`, '')
      .replace(`${clusterPrefix}-`, '');
    return normalizedAppName.startsWith(stripped) || stripped.startsWith(normalizedAppName);
  });
  return (matchedKey ? appConfigs[matchedKey] : null) ?? defaultConfig;
}


export const fetchOrgDBs = (orgId: number, extendedDbEnv: string = process.env.EXTENDED_DB_ENV || '') => {
  const dbListForOrg = [`NeoDb_${orgId}`, `NeoDb_${orgId}_uat`];

  if (extendedDbEnv) {
    try {
      const extendedData = JSON.parse(extendedDbEnv);
      if (extendedData[String(orgId)]) {
        dbListForOrg.push(...JSON.parse(extendedData[String(orgId)]));
      }
    } catch (e) {
      logger.error('fetchOrgDBs: failed to parse EXTENDED_DB_ENV', e);
    }
  }

  return dbListForOrg;
}

const getMongoSlaveUri = () => {
  const uri = config.MONGO_EXTENSIONS_URI;
  if (!uri) throw new Error('MONGO_EXTENSIONS_URI is not configured');
  return uri.includes('?') ? uri : `${uri}?replicaSet=rs0&serverSelectionTimeoutMS=40000`;
};

export const dbCollections = async (db: string): Promise<string[]> => {
  const client = new mongoose.mongo.MongoClient(getMongoSlaveUri());
  try {
    await client.connect();
    const collections = await client.db(db).listCollections().toArray();
    return collections.map((c) => c.name);
  } finally {
    await client.close();
  }
};

export const getCollectionSchema = async (db: string, collection: string): Promise<Array<{ field: string; types: string[] }>> => {
  const client = new mongoose.mongo.MongoClient(getMongoSlaveUri());
  try {
    await client.connect();
    const docs = await client.db(db).collection(collection).aggregate([
      { $sample: { size: 50 } },
      { $project: { fields: { $objectToArray: '$$ROOT' } } },
      { $unwind: '$fields' },
      { $group: { _id: '$fields.k', types: { $addToSet: { $type: '$fields.v' } } } },
      { $sort: { _id: 1 } },
    ]).toArray();
    return docs.map((d: any) => ({ field: d._id, types: d.types }));
  } finally {
    await client.close();
  }
};

const MONGO_DOC_LIMIT_DEFAULT = parseInt(process.env.MONGO_DOC_LIMIT_DEFAULT || '25', 10);
const MONGO_MAX_DOC_LIMIT = parseInt(process.env.MONGO_MAX_DOC_LIMIT || '100', 10);
const QUERY_TIMEOUT_MS = 30000;

const READ_METHODS = new Set([
  'find', 'findOne', 'countDocuments', 'distinct',
  'getIndexes', 'estimatedDocumentCount', 'aggregate', 'explain',
]);

export const isWriteQuery = (query: string): boolean => {
  const methodPattern = /db(?:\.(\w+)|\["(\w+)"\])\.(\w+)\s*\(/g;
  let match;
  while ((match = methodPattern.exec(query)) !== null) {
    const method = match[3];
    if (!READ_METHODS.has(method)) return true;
  }
  return false;
};

const preprocessQuery = (query: string): string => {
  // Add default limit to find() without one
  const findPos = query.lastIndexOf('.find(');
  if (findPos !== -1) {
    const limitPos = query.lastIndexOf('.limit(', findPos);
    if (limitPos === -1) {
      // No limit — append default
      const closePos = query.indexOf(')', findPos + 5);
      if (closePos !== -1) {
        query = query.slice(0, closePos + 1) + `.limit(${MONGO_DOC_LIMIT_DEFAULT})` + query.slice(closePos + 1);
      }
    } else {
      // Cap existing limit
      query = query.replace(/\.limit\((\d+)\)/, (_, n) =>
        `.limit(${Math.min(parseInt(n, 10), MONGO_MAX_DOC_LIMIT)})`
      );
    }
  }
  return query;
};

export const executeMongoQuery = (db: string, query: string): Promise<{ output: string; executionTime: number }> => {
  return new Promise((resolve, reject) => {
    const baseUri = getMongoSlaveUri();
    const processed = preprocessQuery(query);

    // Inject the db name into the URI so mongosh connects directly — avoids the "switched to db" stdout noise
    const uriWithDb = baseUri.replace(/(mongodb(?:\+srv)?:\/\/[^/]+)(\/.*)/, `$1/${db}$2`);

    const END_MARKER = '__QUERY_DONE__';
    const script = `
      try {
        const __r = ${processed};
        const __out = (__r && typeof __r.toArray === 'function') ? __r.toArray() : __r;
        print(JSON.stringify(__out, null, 2));
      } catch(e) {
        print(JSON.stringify({ error: e.message }));
      }
      print("${END_MARKER}");
    `;

    const child = require('child_process').spawn(
      'mongosh',
      [uriWithDb, '--quiet', '--norc', '--eval', script],
      { timeout: QUERY_TIMEOUT_MS }
    );

    let output = '';
    let errOutput = '';
    const start = Date.now();

    child.stdout.on('data', (d: Buffer) => { output += d.toString(); });
    child.stderr.on('data', (d: Buffer) => { errOutput += d.toString(); });

    child.on('close', (code: number) => {
      const executionTime = Date.now() - start;
      const markerIdx = output.indexOf(END_MARKER);
      const result = (markerIdx !== -1 ? output.slice(0, markerIdx) : output).trim();

      if (code !== 0 && !result) {
        return reject(new Error(errOutput.trim() || `mongosh exited with code ${code}`));
      }
      resolve({ output: result, executionTime });
    });

    child.on('error', (err: Error) => reject(err));
  });
};

export interface MongoAuditLogEntry {
  query: string;
  created_by: string;
  query_execution_time: number | null;
  status: 'SUCCESS' | 'FAILED' | 'PENDING_APPROVAL' | 'REJECTED';
  no_of_records: number | null;
  mongo_database: string;
  collection: string;
  org_id: number;
}

export const saveMongoAuditLog = async (entry: MongoAuditLogEntry): Promise<number | null> => {
  const pool = getMySQLPool();
  const [result]: any = await pool.query(
    'INSERT INTO mongo_audit_logs (query, created_by, query_execution_time, status, no_of_records, mongo_database, collection, org_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [entry.query, entry.created_by, entry.query_execution_time, entry.status, entry.no_of_records, entry.mongo_database, entry.collection, entry.org_id],
  );
  return result?.insertId ?? null;
};

export const getMongoAuditLogById = async (id: number, orgId: number) => {
  const pool = getMySQLPool();
  const [rows]: any = await pool.query(
    'SELECT id, query, created_by, created_at, status, no_of_records, query_execution_time, mongo_database, collection, approved_by, updated_at, hotswap_id FROM mongo_audit_logs WHERE id = ? AND org_id = ?',
    [id, orgId],
  );
  return rows?.[0] ?? null;
};

export const getMongoAuditLogs = async (orgId: number, filters: { status?: string; search?: string; lastId?: number } = {}) => {
  const pool = getMySQLPool();
  const conditions: string[] = ['org_id = ?'];
  const values: any[] = [orgId];

  if (filters.status) {
    conditions.push('status = ?');
    values.push(filters.status.toUpperCase());
  }
  if (filters.search) {
    conditions.push('(created_by LIKE ? OR query LIKE ?)');
    values.push(`%${filters.search}%`, `%${filters.search}%`);
  }
  if (filters.lastId) {
    conditions.push('id < ?');
    values.push(filters.lastId);
  }

  const where = `WHERE ${conditions.join(' AND ')}`;
  const [rows] = await pool.query(
    `SELECT id, query, created_by, created_at, status, no_of_records, query_execution_time, mongo_database, collection FROM mongo_audit_logs ${where} ORDER BY created_at DESC LIMIT 50`,
    values,
  );
  return rows;
};



const hotswapAuth = () =>
  'Basic ' + Buffer.from(`${config.HOTSWAP_USER}:${config.HOTSWAP_PASSWORD}`).toString('base64');

export const approveMongoAuditLog = async (id: number, orgId: number, approverUser: string) => {
  const pool = getMySQLPool();
  const [rows]: any = await pool.query(
    'SELECT id, created_by, status, hotswap_id FROM mongo_audit_logs WHERE id = ? AND org_id = ?',
    [id, orgId],
  );
  const entry = rows?.[0];
  if (!entry) throw new Error('Audit log not found');
  if (entry.status !== 'PENDING_APPROVAL') throw new Error('Query is already approved/rejected');
  if (entry.created_by?.split('@')[0] === approverUser?.split('@')[0]) throw new Error('Approver and creator cannot be the same person');

  const hotswapId = String(entry.hotswap_id);
  const res = await callApi({
    url: `${config.HOTSWAP_URL}/manual/internal/approve/${hotswapId}`,
    method: 'POST',
    headers: { Authorization: hotswapAuth(), 'X-Cap-User-Id': approverUser },
  });

  if (res.success) {
    await pool.query('UPDATE mongo_audit_logs SET status = ?, approved_by = ? WHERE id = ?', ['SUCCESS', approverUser, id]);
  }
  return res.data;
};

export const rejectMongoAuditLog = async (id: number, orgId: number, rejectorUser: string) => {
  const pool = getMySQLPool();
  const [rows]: any = await pool.query(
    'SELECT id, status, hotswap_id FROM mongo_audit_logs WHERE id = ? AND org_id = ?',
    [id, orgId],
  );
  const entry = rows?.[0];
  if (!entry) throw new Error('Audit log not found');
  if (entry.status !== 'PENDING_APPROVAL') throw new Error('Query is already approved/rejected');

  const hotswapId = String(entry.hotswap_id);
  const res = await callApi({
    url: `${config.HOTSWAP_URL}/manual/internal/${hotswapId}/reject`,
    method: 'POST',
    headers: { Authorization: hotswapAuth(), 'X-Cap-User-Id': rejectorUser },
  });

  if (res.success) {
    await pool.query('UPDATE mongo_audit_logs SET status = ?, approved_by = ? WHERE id = ?', ['REJECTED', rejectorUser, id]);
  }
  return res.data;
};

export const fetchLokiLogs = async (
  orgId: number,
  appName: string,
  extension: string,
  search: string,
  startTime: number,
  endTime: number,
  isFullLogsChecked: boolean,
  type: string = 'app',
  newRelicAppName: string | null = null,
  userTimezone: string = DEFAULT_USER_TIMEZONE,
) => {
  if (!config.LOKI_URL) {
    logger.error('LOKI_URL is not configured in env');
    return {
      logs: [] as string[],
      totalEntries: 0,
      lastTimestamp: null as string | null,
    };
  }

  if (newRelicAppName) {
    logger.warn(
      `newRelicAppName=${newRelicAppName} provided but mapping is not implemented yet; falling back to provided appName/extension`,
    );
  }

  const requestType: string = extension
    ? determineRequestType(extension)
    : type;

  const filter_string =
    requestType === 'extension'
      ? buildExtensionFilter(extension)
      : buildOrgFilter(orgId, appName);

  const app_config = getLokiAppConfig(appName);
  const new_newlog: boolean = Boolean(app_config.new_newlog);

  logger.info(`Limit at backend side: ${LOKI_DEFAULT_LIMIT}`);
  logger.info(`Received search parameter: ${search}`);
  const searchTerms = parseSearchInput(search);
  logger.info(
    `Parsed search terms as dict objects: ${JSON.stringify(searchTerms)}`,
  );

  const lokiQuery = buildLokiQuery(
    appName,
    filter_string,
    searchTerms.length > 0 ? searchTerms : null,
  );

  logger.info(
    `App: ${appName}, Request Type: ${requestType}, Filter: ${filter_string}`,
  );
  if (searchTerms.length > 0) {
    logger.info(
      `Using search mode with search terms: ${JSON.stringify(searchTerms)}`,
    );
  } else {
    logger.info(`Using basic mode with formatted filter: ${filter_string}`);
  }
  logger.info(`Generated Query: ${lokiQuery}`);

  const startNs = toLokiNanos(startTime);
  const endNs = toLokiNanos(endTime);
  logger.info(`Using startTime as epoch timestamp: ${startNs}`);
  logger.info(`Using endTime as epoch timestamp: ${endNs}`);

  const params = new URLSearchParams({
    query: lokiQuery,
    limit: String(LOKI_DEFAULT_LIMIT),
    direction: 'forward',
    start: startNs,
    end: endNs,
  });
  logger.info(
    `Final params: ${JSON.stringify(Object.fromEntries(params.entries()))}`,
  );
  logger.info(`Making request to Loki URL: ${config.LOKI_URL}`);

  let response;
  try {
    response = await callApi<LokiQueryResponse>({
      url: `${config.LOKI_URL}?${params.toString()}`,
    });
  } catch (err) {
    logger.error(
      `Loki request failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
    );
    throw err;
  }

  logger.info(`Loki response status: ${response.status}`);

  if (!response.success) {
    logger.error(
      `Loki request failed. Status: ${response.status}. Response: ${JSON.stringify(response.data)?.slice(0, 500)}`,
    );
    return {
      logs: [] as string[],
      totalEntries: 0,
      lastTimestamp: null as string | null,
    };
  }

  const streams = response.data?.data?.result ?? [];
  const merged = streams
    .flatMap((s) => (Array.isArray(s.values) ? s.values : []))
    .sort(([a], [b]) => a.localeCompare(b));

  logger.info(`Loki logs length: ${merged.length}`);

  const logs = merged.map((entry) =>
    convertLog(entry, isFullLogsChecked, requestType, new_newlog, userTimezone),
  );

  return {
    logs,
    totalEntries: logs.length,
    lastTimestamp: merged.at(-1)?.[0] ?? null,
  };
};

const BUGSNAG_API_BASE = 'https://api.bugsnag.com';

const bugsnagHeaders = () => ({
  Authorization: `token ${config.BUGSNAG_API_TOKEN}`,
  'Content-Type': 'application/json',
});

export const getBugsnagProjects = async (): Promise<Array<{ id: string; name: string; slug: string }>> => {
  if (!config.BUGSNAG_ORGANIZATION_ID) throw new Error('BUGSNAG_ORGANIZATION_ID is not configured');
  const response = await callApi<Array<{ id: string; name: string; slug: string }>>({
    url: `${BUGSNAG_API_BASE}/organizations/${config.BUGSNAG_ORGANIZATION_ID}/projects?per_page=100`,
    headers: bugsnagHeaders(),
  });
  if (!response.success) throw new Error(`Bugsnag projects fetch failed: ${response.status}`);
  return response.data ?? [];
};

export const getBugsnagIssues = async (_orgId: string, vulcanApp: string, fromDate?: string, toDate?: string) => {
  const projects = await getBugsnagProjects();
  let project = projects.find((p) =>
    p.name?.toLowerCase() === vulcanApp?.toLowerCase() ||
    p.slug?.toLowerCase() === vulcanApp?.toLowerCase()
  );
  if (!project && projects.length > 0) project = projects[0];
  if (!project) return { issues: [], projectId: null };

  const params = new URLSearchParams({ per_page: '50', sort: 'last_seen' });
  if (fromDate) params.set('filters[since][][value]', fromDate);
  if (toDate) params.set('filters[before][][value]', toDate);

  const response = await callApi<Array<any>>({
    url: `${BUGSNAG_API_BASE}/projects/${project.id}/errors?${params.toString()}`,
    headers: bugsnagHeaders(),
  });
  if (!response.success) throw new Error(`Bugsnag issues fetch failed: ${response.status}`);

  const issues = (response.data ?? []).map((e: any) => ({
    id: e.id,
    errorClass: e.error_class,
    context: e.context,
    message: e.message,
    events: e.events,
    users: e.users,
    severity: e.severity,
    status: e.status,
    lastSeen: e.last_seen,
    projectId: project!.id,
  }));

  return { issues, projectId: project.id };
};

export const updateBugsnagErrorStatus = async (projectId: string, errorId: string, action: 'open' | 'fixed' | 'ignored') => {
  const statusMap: Record<string, string> = { open: 'open', fixed: 'fixed', ignored: 'ignored' };
  const response = await callApi({
    url: `${BUGSNAG_API_BASE}/projects/${projectId}/errors/${errorId}`,
    method: 'PATCH',
    headers: bugsnagHeaders(),
    body: { status: statusMap[action] || action },
  });
  if (!response.success) throw new Error(`Bugsnag update error status failed: ${response.status}`);
  return response.data;
};

export const getBugsnagConfig = async (orgId: number, vulcanApp: string) => {
  const pool = getMySQLPool();
  const [rows]: any = await pool.query(
    'SELECT config_json FROM bugsnag_config WHERE org_id = ? AND vulcan_app = ? ORDER BY updated_at DESC LIMIT 1',
    [orgId, vulcanApp],
  );
  if (!rows?.[0]) return null;
  try {
    return JSON.parse(rows[0].config_json);
  } catch {
    return null;
  }
};

export const saveBugsnagConfig = async (orgId: number, vulcanApp: string, configData: Record<string, any>) => {
  const pool = getMySQLPool();
  await pool.query(
    `INSERT INTO bugsnag_config (org_id, vulcan_app, config_json)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE config_json = VALUES(config_json), updated_at = NOW()`,
    [orgId, vulcanApp, JSON.stringify(configData)],
  );

  // Sync stability targets to Bugsnag API
  const projects = await getBugsnagProjects().catch(() => []);
  const project = projects.find(
    (p) => p.name?.toLowerCase() === vulcanApp?.toLowerCase() || p.slug?.toLowerCase() === vulcanApp?.toLowerCase(),
  );
  if (project && (configData.target_stability != null || configData.critical_stability != null)) {
    await callApi({
      url: `${BUGSNAG_API_BASE}/projects/${project.id}`,
      method: 'PATCH',
      headers: bugsnagHeaders(),
      body: {
        ...(configData.target_stability != null && { stability_threshold: configData.target_stability }),
        ...(configData.critical_stability != null && { stability_threshold_critical: configData.critical_stability }),
      },
    });
  }

  return { success: true };
};

export const getApplications = async (orgId: number, appName: string) => {
  logger.info(`getApplications: org ${orgId}, appName ${appName}`);
  const apps = [];
  if (appName.toLowerCase() === 'vulcan') {
    try {
      const url = `${config.VULCAN_SERVICE_HOST}/vulcan/api/v1/metadata/list?limit=1000&offset=0`;
      const response = await callApi<{ result: { applications: Array<{ name: string; orgId: number; accessibleOrgs: number[] }> } }>({
        url,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${config.INTOUCH_AUTH_TOKEN}`,
          'x-cap-api-auth-org-id': String(orgId),
          'User-Agent': DEVCONSOLE_USER_AGENT,
        },
      });
      const applications = response.data?.result?.applications ?? [];
      for (const app of applications) {
        if (app.orgId === Number(orgId) || (Array.isArray(app.accessibleOrgs) && app.accessibleOrgs.includes(Number(orgId)))) {
          apps.push({ type: 'vulcan', display: `Vulcan - ${app.name}`, name: app.name });
        }
      }
    } catch (e) {
      logger.error(`getApplications: failed to fetch vulcan apps for org ${orgId}`, e);
    }
  }
  return apps;
}
