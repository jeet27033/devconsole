import config from '../config';
import logger from '../helpers/logger';
import { callApi } from '../helpers/apiCaller';
import { getMySQLPool } from '../loaders/mysql';
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
  LOKI_TIMESTAMP_NS_DIGITS,
} from '../constants/constants';
import {
  buildExtensionJobConfigXml,
  GRAFANA_APP_NAME_FOR_EXTENSION,
  LOKI_QUERY_CONFIG,
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

const determineRequestType = (extension: string) => {
  const capillaryPattern = LOKI_QUERY_CONFIG['capillary_extension_pattern'];

  //Only check for @capillarytech extensions - everything else is treated as app
  if (extension && extension.includes(capillaryPattern)) {
    return 'extension';
  }
  return 'app';
};

const buildExtensionFilter = (extension: string) => {
  return `"extension":"${extension.toLowerCase()}"`;
};

const getAppConfig = (appName: string) => {
  const appConfigs = LOKI_QUERY_CONFIG.app_configs as any;
  return appConfigs[appName] || LOKI_QUERY_CONFIG.default_config;
};

const buildOrgFilter = (orgId: number, appName: string) => {
  const orgFilterFormat = getAppConfig(appName).org_filter_format;
  logger.info(`Org filter format: ${orgFilterFormat}`);
  if (!orgId || !orgFilterFormat) {
    return '';
  }
  return orgFilterFormat.replace('{orgId}', String(orgId));
};

type SearchTerm = { term: string; operator?: 'contains' | 'not_contains' };
type SearchInput = string | SearchTerm[] | null | undefined;

const parseSearchInput = (raw: string | null | undefined): SearchTerm[] => {
  if (!raw) return [];

  const toTerm = (item: unknown): SearchTerm | null => {
    if (typeof item === 'string' && item.trim()) {
      return { term: item.trim(), operator: 'contains' };
    }
    if (item && typeof item === 'object' && 'term' in item) {
      const term = String((item as any).term ?? '').trim();
      if (!term) return null;
      const operator = (item as any).operator === 'not_contains' ? 'not_contains' : 'contains';
      return { term, operator };
    }
    return null;
  };

  try {
    const parsed = JSON.parse(raw);
    const items = Array.isArray(parsed) ? parsed : [parsed];
    return items.flatMap((item) => {
      const t = toTerm(item);
      return t ? [t] : [];
    });
  } catch {
    const trimmed = raw.trim();
    return trimmed ? [{ term: trimmed, operator: 'contains' }] : [];
  }
};

const buildSearchFilters = (input: SearchInput): string[] => {
  if (!input) return [];

  if (typeof input === 'string') {
    const trimmed = input.trim();
    return trimmed ? [`|= \`${trimmed}\``] : [];
  }

  return input.flatMap((item) => {
    const term = item?.term?.trim();
    if (!term) return [];
    const operator = item.operator ?? 'contains';
    if (operator === 'contains') return [`|= \`${term}\``];
    if (operator === 'not_contains') return [`!~ \`${term}\``];
    return [];
  });
};

const buildLokiQuery = (
  appName: string,
  filterString: string,
  searchInput?: SearchInput,
): string => {
  const appConfig = getAppConfig(appName);
  const appNames: string[] = appConfig.app_names || [appName];
  const useRegex: boolean = appConfig.use_regex;

  const appFilter =
    useRegex && appNames.length > 1
      ? `{app=~"(${appNames.join('|')})"}`
      : `{app="${appNames[0]}"}`;

  const queryParts: string[] = [appFilter];

  if (searchInput != null) {
    queryParts.push(...buildSearchFilters(searchInput));
    if (!appConfig.skip_extension_in_search && filterString) {
      queryParts.push(`|= \`${filterString}\``);
    }
  } else if (!appConfig.skip_extension_filter && filterString) {
    queryParts.push(`|= \`${filterString}\``);
  }

  return queryParts.join(' ');
};

const toLokiNanos = (epoch: number): string =>
  String(epoch).padEnd(LOKI_TIMESTAMP_NS_DIGITS, '0');

const formatLogTimestamp = (nsTimestamp: string, timezone: string): string =>
  new Intl.DateTimeFormat('sv-SE', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date(Number(nsTimestamp) / 1e6));

const SUMMARY_FIELDS: Array<[string, string]> = [
  ['Time', 'time'],
  ['reqId', 'reqId'],
  ['msg', 'msg'],
];

const convertLog = (
  entry: [string, string],
  isFullLogsChecked: boolean,
  requestType: string | null,
  newNewlog: boolean,
  userTimezone: string,
): string => {
  const [timestampNs, log] = entry;
  const trimToSummary =
    !isFullLogsChecked &&
    (requestType === 'extension' || (requestType === 'app' && newNewlog));

  let finalLog = log;
  if (trimToSummary) {
    const match = log.match(/{.*}/);
    if (match) {
      try {
        const parsed = JSON.parse(match[0]) as Record<string, unknown>;
        const summary = SUMMARY_FIELDS.flatMap(([label, key]) =>
          parsed[key] != null ? [`${label}: ${parsed[key]}`] : [],
        );
        if (summary.length > 0) finalLog = summary.join(', ');
      } catch {
        // keep original log
      }
    }
  }

  return `${formatLogTimestamp(timestampNs, userTimezone)} : ${finalLog}`;
};

type LokiStream = {
  stream: Record<string, string>;
  values: [string, string][];
};
type LokiQueryResponse = { data: { result: LokiStream[] } };

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

  const app_config = getAppConfig(appName);
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
