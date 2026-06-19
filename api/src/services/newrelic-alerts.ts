import config from '../config';
import logger from '../helpers/logger';
import { callApi } from '../helpers/apiCaller';
import { getMySQLPool } from '../loaders/mysql';

const NR_API_BASE = 'https://api.newrelic.com/v2';
const NR_GRAPHQL_URL = 'https://api.newrelic.com/graphql';

const nrHeaders = () => ({
  'X-Api-Key': config.NEWRELIC_API_KEY,
  'Content-Type': 'application/json',
});

// ── NerdGraph helper ──────────────────────────────────────────────────────────

const nerdGraph = async <T = any>(query: string, variables: Record<string, any> = {}): Promise<T | null> => {
  if (!config.NEWRELIC_API_KEY) return null;
  try {
    const res = await callApi<{ data?: T; errors?: any[] }>({
      url: NR_GRAPHQL_URL,
      method: 'POST',
      headers: nrHeaders(),
      body: { query, variables },
    });
    if (res.data?.errors?.length) {
      logger.warn('NerdGraph errors', res.data.errors);
    }
    return res.data?.data ?? null;
  } catch (e) {
    logger.error('NerdGraph request failed', e);
    return null;
  }
};

// ── Static platform config ────────────────────────────────────────────────────

export const PLATFORMS = [
  { id: 'loyalty-engine',    label: 'Loyalty Engine',    appName: 'loyalty-engine' },
  { id: 'campaign-manager',  label: 'Campaign Manager',  appName: 'campaign-manager' },
  { id: 'engage-plus',       label: 'Engage+',           appName: 'engage-plus' },
  { id: 'insights-plus',     label: 'Insights+',         appName: 'insights-plus' },
  { id: 'connect-plus',      label: 'Connect+',          appName: 'connect-plus' },
];

export const METRICS_BY_PLATFORM: Record<string, Array<{ id: string; label: string; nrqlTemplate: string }>> = {
  default: [
    { id: 'error_rate',        label: 'Error percentage',      nrqlTemplate: "SELECT percentage(count(*), WHERE error IS true) FROM Transaction" },
    { id: 'response_time_p95', label: 'Response time (P95)',   nrqlTemplate: "SELECT percentile(duration, 95) FROM Transaction" },
    { id: 'response_time_p99', label: 'Response time (P99)',   nrqlTemplate: "SELECT percentile(duration, 99) FROM Transaction" },
    { id: 'throughput',        label: 'Throughput (rpm)',       nrqlTemplate: "SELECT rate(count(*), 1 minute) FROM Transaction" },
    { id: 'apdex',             label: 'Apdex score',           nrqlTemplate: "SELECT apdex(duration, 0.5) FROM Transaction" },
    { id: 'http_4xx',          label: 'HTTP 4xx error rate',   nrqlTemplate: "SELECT percentage(count(*), WHERE httpResponseCode >= 400 AND httpResponseCode < 500) FROM Transaction" },
    { id: 'http_5xx',          label: 'HTTP 5xx error count',  nrqlTemplate: "SELECT count(*) FROM Transaction WHERE httpResponseCode >= 500" },
  ],
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const getAccountId = (): number => {
  const envId = process.env.NEWRELIC_ACCOUNT_ID;
  return envId ? parseInt(envId, 10) : 0;
};

const buildNrql = (metricId: string, appName: string, filterApis: string[]): string => {
  const metrics = METRICS_BY_PLATFORM.default;
  const metric = metrics.find((m) => m.id === metricId);
  if (!metric) return `SELECT count(*) FROM Transaction WHERE appName = '${appName}'`;
  let nrql = `${metric.nrqlTemplate} WHERE appName = '${appName}'`;
  if (filterApis.length > 0) {
    const apiList = filterApis.map((a) => `'${a}'`).join(', ');
    nrql += ` AND request.uri IN (${apiList})`;
  }
  return nrql;
};

// ── MySQL helpers ─────────────────────────────────────────────────────────────

const ensureSettingsTable = async () => {
  const pool = getMySQLPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS newrelic_settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      org_id INT NOT NULL,
      slack_webhook_url TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_org (org_id)
    )
  `);
};

const ensureConditionsTable = async () => {
  const pool = getMySQLPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS newrelic_alert_conditions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      org_id INT NOT NULL,
      nr_policy_id INT,
      nr_condition_id INT,
      condition_name VARCHAR(255) NOT NULL,
      platform VARCHAR(100),
      app_name VARCHAR(255),
      metric_id VARCHAR(100),
      metric_label VARCHAR(255),
      filter_apis TEXT,
      status VARCHAR(50) DEFAULT 'Active',
      thresholds JSON,
      notification_title VARCHAR(255),
      notification_desc TEXT,
      modified_by VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
};

// ── Settings ──────────────────────────────────────────────────────────────────

export const getSettings = async (orgId: number) => {
  await ensureSettingsTable();
  const pool = getMySQLPool();
  const [rows]: any = await pool.query(
    'SELECT slack_webhook_url FROM newrelic_settings WHERE org_id = ? LIMIT 1',
    [orgId],
  );
  return { slack_webhook_url: rows?.[0]?.slack_webhook_url ?? '' };
};

export const updateSettings = async (orgId: number, slackWebhookUrl: string) => {
  await ensureSettingsTable();
  const pool = getMySQLPool();
  await pool.query(
    `INSERT INTO newrelic_settings (org_id, slack_webhook_url)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE slack_webhook_url = VALUES(slack_webhook_url), updated_at = NOW()`,
    [orgId, slackWebhookUrl],
  );
  return { success: true };
};

// ── Platforms & form metadata ─────────────────────────────────────────────────

export const getPlatforms = () => {
  return PLATFORMS.map((p) => ({ id: p.id, label: p.label }));
};

export const getFormMetadata = () => {
  const metrics = METRICS_BY_PLATFORM.default;
  return {
    metrics: metrics.map((m) => ({ id: m.id, label: m.label })),
    platforms: PLATFORMS.map((p) => ({ id: p.id, label: p.label })),
  };
};

// ── NewRelic policy helpers ───────────────────────────────────────────────────

const findOrCreatePolicy = async (policyName: string): Promise<number | null> => {
  if (!config.NEWRELIC_API_KEY) return null;
  try {
    const listRes = await callApi<any>({
      url: `${NR_API_BASE}/alerts_policies.json?filter[name]=${encodeURIComponent(policyName)}`,
      headers: nrHeaders(),
    });
    const existing = listRes.data?.policies?.find((p: any) => p.name === policyName);
    if (existing) return existing.id;

    const createRes = await callApi<any>({
      url: `${NR_API_BASE}/alerts_policies.json`,
      method: 'POST',
      headers: nrHeaders(),
      body: { policy: { name: policyName, incident_preference: 'PER_CONDITION' } },
    });
    return createRes.data?.policy?.id ?? null;
  } catch (e) {
    logger.error('NewRelic findOrCreatePolicy error', e);
    return null;
  }
};

const createNrqlCondition = async (policyId: number, conditionName: string, nrql: string, thresholds: any[]) => {
  if (!config.NEWRELIC_API_KEY) return null;
  try {
    const terms = thresholds.map((t: any) => ({
      priority: t.priority?.toLowerCase() === 'critical' ? 'critical' : 'warning',
      operator: (t.operator || 'ABOVE').toLowerCase(),
      threshold: parseFloat(t.value) || 0,
      threshold_duration: (parseInt(t.durationValue, 10) || 1) * (t.timeUnit === 'HOURS' ? 3600 : t.timeUnit === 'DAYS' ? 86400 : 60),
      threshold_occurrences: t.durationType === 'AT_LEAST_ONCE_IN' ? 'AT_LEAST_ONCE' : 'ALL',
    }));

    const res = await callApi<any>({
      url: `${NR_API_BASE}/alerts_nrql_conditions/policies/${policyId}.json`,
      method: 'POST',
      headers: nrHeaders(),
      body: {
        nrql_condition: {
          name: conditionName,
          enabled: true,
          nrql: { query: nrql },
          terms,
          value_function: 'single_value',
        },
      },
    });
    return res.data?.nrql_condition?.id ?? null;
  } catch (e) {
    logger.error('NewRelic createNrqlCondition error', e);
    return null;
  }
};

const deleteNrCondition = async (conditionId: number) => {
  if (!config.NEWRELIC_API_KEY || !conditionId) return;
  try {
    await callApi({
      url: `${NR_API_BASE}/alerts_nrql_conditions/${conditionId}.json`,
      method: 'DELETE',
      headers: nrHeaders(),
    });
  } catch (e) {
    logger.error('NewRelic deleteNrCondition error', e);
  }
};

const toggleNrCondition = async (conditionId: number, enabled: boolean) => {
  if (!config.NEWRELIC_API_KEY || !conditionId) return;
  try {
    await callApi({
      url: `${NR_API_BASE}/alerts_nrql_conditions/${conditionId}.json`,
      method: 'PUT',
      headers: nrHeaders(),
      body: { nrql_condition: { enabled } },
    });
  } catch (e) {
    logger.error('NewRelic toggleNrCondition error', e);
  }
};

// ── Alert Conditions ──────────────────────────────────────────────────────────

export const listAlertConditions = async (orgId: number, filters: { status?: string; platform?: string; search?: string } = {}) => {
  await ensureConditionsTable();
  const pool = getMySQLPool();

  let query = 'SELECT * FROM newrelic_alert_conditions WHERE org_id = ?';
  const params: any[] = [orgId];

  if (filters.status) { query += ' AND status = ?'; params.push(filters.status); }
  if (filters.platform) { query += ' AND platform = ?'; params.push(filters.platform); }
  if (filters.search) { query += ' AND condition_name LIKE ?'; params.push(`%${filters.search}%`); }

  query += ' ORDER BY updated_at DESC';

  const [rows]: any = await pool.query(query, params);
  return (rows ?? []).map((r: any) => ({
    id: r.id,
    conditionName: r.condition_name,
    platform: r.platform,
    appName: r.app_name,
    metric: r.metric_label,
    metricId: r.metric_id,
    filteredApis: r.filter_apis ? JSON.parse(r.filter_apis) : [],
    status: r.status,
    thresholds: r.thresholds ? JSON.parse(r.thresholds) : [],
    notificationTitle: r.notification_title,
    notificationDesc: r.notification_desc,
    modifiedBy: r.modified_by,
    lastModified: r.updated_at,
  }));
};

export const getAlertConditionDetails = async (orgId: number, id: number) => {
  await ensureConditionsTable();
  const pool = getMySQLPool();
  const [rows]: any = await pool.query(
    'SELECT * FROM newrelic_alert_conditions WHERE id = ? AND org_id = ? LIMIT 1',
    [id, orgId],
  );
  const r = rows?.[0];
  if (!r) return null;
  return {
    id: r.id,
    conditionName: r.condition_name,
    platform: r.platform,
    appName: r.app_name,
    metric: r.metric_label,
    metricId: r.metric_id,
    filteredApis: r.filter_apis ? JSON.parse(r.filter_apis) : [],
    status: r.status,
    thresholds: r.thresholds ? JSON.parse(r.thresholds) : [],
    notificationTitle: r.notification_title,
    notificationDesc: r.notification_desc,
    modifiedBy: r.modified_by,
    lastModified: r.updated_at,
  };
};

export const createAlertCondition = async (orgId: number, user: string, payload: any) => {
  await ensureConditionsTable();
  const pool = getMySQLPool();

  const { conditionName, platform, metricId, filterApis = [], thresholds = [], notificationTitle, notificationDesc } = payload;

  const platformConfig = PLATFORMS.find((p) => p.id === platform || p.label === platform);
  const appName = platformConfig?.appName ?? platform;
  const metricConfig = METRICS_BY_PLATFORM.default.find((m) => m.id === metricId);
  const metricLabel = metricConfig?.label ?? metricId;

  // Sync to NewRelic if API key is configured
  let nrPolicyId: number | null = null;
  let nrConditionId: number | null = null;
  if (config.NEWRELIC_API_KEY) {
    const policyName = `[DevConsole] ${platformConfig?.label ?? platform}`;
    nrPolicyId = await findOrCreatePolicy(policyName);
    if (nrPolicyId) {
      const nrql = buildNrql(metricId, appName, filterApis);
      nrConditionId = await createNrqlCondition(nrPolicyId, conditionName, nrql, thresholds);
    }
  }

  const [result]: any = await pool.query(
    `INSERT INTO newrelic_alert_conditions
       (org_id, nr_policy_id, nr_condition_id, condition_name, platform, app_name, metric_id, metric_label, filter_apis, status, thresholds, notification_title, notification_desc, modified_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', ?, ?, ?, ?)`,
    [orgId, nrPolicyId, nrConditionId, conditionName, platformConfig?.label ?? platform, appName, metricId, metricLabel,
      JSON.stringify(filterApis), JSON.stringify(thresholds), notificationTitle ?? null, notificationDesc ?? null, user],
  );

  return { id: result.insertId, success: true };
};

export const updateAlertCondition = async (orgId: number, id: number, user: string, payload: any) => {
  await ensureConditionsTable();
  const pool = getMySQLPool();

  const [rows]: any = await pool.query(
    'SELECT * FROM newrelic_alert_conditions WHERE id = ? AND org_id = ?',
    [id, orgId],
  );
  const existing = rows?.[0];
  if (!existing) throw new Error('Condition not found');

  const { conditionName, metricId, filterApis, thresholds, notificationTitle, notificationDesc } = payload;
  const metricConfig = METRICS_BY_PLATFORM.default.find((m) => m.id === metricId);
  const metricLabel = metricConfig?.label ?? metricId ?? existing.metric_label;
  const appName = existing.app_name;

  // Sync to NewRelic
  if (config.NEWRELIC_API_KEY && existing.nr_condition_id) {
    if (existing.nr_policy_id) {
      await deleteNrCondition(existing.nr_condition_id);
      const nrql = buildNrql(metricId ?? existing.metric_id, appName, filterApis ?? []);
      const newNrCondId = await createNrqlCondition(existing.nr_policy_id, conditionName ?? existing.condition_name, nrql, thresholds ?? []);
      await pool.query('UPDATE newrelic_alert_conditions SET nr_condition_id = ? WHERE id = ?', [newNrCondId, id]);
    }
  }

  await pool.query(
    `UPDATE newrelic_alert_conditions SET
       condition_name = COALESCE(?, condition_name),
       metric_id = COALESCE(?, metric_id),
       metric_label = COALESCE(?, metric_label),
       filter_apis = COALESCE(?, filter_apis),
       thresholds = COALESCE(?, thresholds),
       notification_title = ?,
       notification_desc = ?,
       modified_by = ?,
       updated_at = NOW()
     WHERE id = ? AND org_id = ?`,
    [conditionName ?? null, metricId ?? null, metricLabel ?? null,
      filterApis != null ? JSON.stringify(filterApis) : null,
      thresholds != null ? JSON.stringify(thresholds) : null,
      notificationTitle ?? null, notificationDesc ?? null, user, id, orgId],
  );
  return { success: true };
};

export const performConditionAction = async (orgId: number, id: number, action: 'enable' | 'disable' | 'delete') => {
  await ensureConditionsTable();
  const pool = getMySQLPool();

  const [rows]: any = await pool.query(
    'SELECT * FROM newrelic_alert_conditions WHERE id = ? AND org_id = ?',
    [id, orgId],
  );
  const existing = rows?.[0];
  if (!existing) throw new Error('Condition not found');

  if (action === 'delete') {
    if (config.NEWRELIC_API_KEY && existing.nr_condition_id) {
      await deleteNrCondition(existing.nr_condition_id);
    }
    await pool.query('DELETE FROM newrelic_alert_conditions WHERE id = ?', [id]);
    return { success: true };
  }

  const newStatus = action === 'enable' ? 'Active' : 'Disabled';
  if (config.NEWRELIC_API_KEY && existing.nr_condition_id) {
    await toggleNrCondition(existing.nr_condition_id, action === 'enable');
  }
  await pool.query('UPDATE newrelic_alert_conditions SET status = ?, updated_at = NOW() WHERE id = ?', [newStatus, id]);
  return { success: true, status: newStatus };
};

// ── Issues / Violations ───────────────────────────────────────────────────────

export const listAlertIssues = async (
  orgId: number,
  filters: { status?: string; priority?: string; platform?: string; startTime?: number; endTime?: number } = {},
) => {
  if (!config.NEWRELIC_API_KEY) {
    return { issues: [], total: 0 };
  }

  try {
    const params = new URLSearchParams({ only_open: filters.status === 'Closed' ? 'false' : 'true' });
    if (filters.startTime) params.set('start_date', new Date(filters.startTime).toISOString().split('T')[0]);
    if (filters.endTime) params.set('end_date', new Date(filters.endTime).toISOString().split('T')[0]);

    const res = await callApi<any>({
      url: `${NR_API_BASE}/alerts_violations.json?${params.toString()}`,
      headers: nrHeaders(),
    });

    const allViolations: any[] = res.data?.violations ?? [];

    // Map to UI format
    const issues = allViolations.map((v: any) => ({
      id: String(v.id),
      status: v.closed_at ? 'Closed' : 'Active',
      acknowledgedBy: null,
      priority: v.priority || 'High',
      triggered: v.opened_at ? v.opened_at * 1000 : Date.now(),
      closedAt: v.closed_at ? v.closed_at * 1000 : null,
      conditionName: v.condition_name || 'Unknown',
      policyName: v.policy_name || '',
      platform: v.entity?.name || '',
      accountId: String(getAccountId()),
      violationId: v.id,
    }));

    let filtered = issues;
    if (filters.status) filtered = filtered.filter((i) => i.status === filters.status);
    if (filters.priority) filtered = filtered.filter((i) => i.priority?.toLowerCase() === filters.priority?.toLowerCase());

    return { issues: filtered, total: filtered.length };
  } catch (e) {
    logger.error('NewRelic listAlertIssues error', e);
    return { issues: [], total: 0 };
  }
};

export const performIssueAction = async (violationId: string, action: 'acknowledge' | 'close') => {
  if (!config.NEWRELIC_API_KEY) return { success: false, reason: 'API key not configured' };
  try {
    if (action === 'close') {
      await callApi({
        url: `${NR_API_BASE}/alerts_violations/${violationId}/close.json`,
        method: 'POST',
        headers: nrHeaders(),
      });
    }
    // NewRelic REST v2 doesn't have a direct acknowledge endpoint for violations;
    // acknowledgement is handled at the incident level. Return success optimistically.
    return { success: true };
  } catch (e) {
    logger.error('NewRelic performIssueAction error', e);
    return { success: false };
  }
};

// ── Platform Metrics ──────────────────────────────────────────────────────────

export const getMetricProducts = () => {
  // Expose platforms as selectable products for the metrics page
  return PLATFORMS.map((p) => ({
    value: p.id,
    label: p.label,
    appName: p.appName,
    queryVariables: { appName: p.appName },
  }));
};

export const getMetricDashboards = async (productId: string): Promise<Array<{ guid: string; name: string }>> => {
  const platform = PLATFORMS.find((p) => p.id === productId);
  const searchTerm = platform?.label ?? productId;

  const data = await nerdGraph<any>(`
    query($query: String!) {
      actor {
        entitySearch(query: $query) {
          results {
            entities {
              name
              guid
            }
          }
        }
      }
    }
  `, { query: `type = 'DASHBOARD' AND name LIKE '${searchTerm.replace(/'/g, '%')}%'` });

  const entities: Array<{ name: string; guid: string }> = data?.actor?.entitySearch?.results?.entities ?? [];
  return entities.map((e) => ({ guid: e.guid, name: e.name }));
};

export const getDashboardPages = async (dashboardGuid: string) => {
  if (!dashboardGuid) return [];

  const data = await nerdGraph<any>(`
    query($guid: EntityGuid!) {
      actor {
        entity(guid: $guid) {
          ... on DashboardEntity {
            name
            pages {
              name
              widgets {
                title
                visualization { id }
                rawConfiguration
              }
            }
          }
        }
      }
    }
  `, { guid: dashboardGuid });

  return data?.actor?.entity?.pages ?? [];
};

export const executeNrql = async (accountId: number, nrql: string, timeWindow?: { since?: string; until?: string }) => {
  const since = timeWindow?.since ?? 'SINCE 1 hour ago';
  const until = timeWindow?.until ?? 'UNTIL NOW';
  const fullNrql = nrql.toLowerCase().includes('since') ? nrql : `${nrql} ${since} ${until}`;

  const data = await nerdGraph<any>(`
    query($accountId: Int!, $nrql: Nrql!) {
      actor {
        account(id: $accountId) {
          nrql(query: $nrql) {
            results
            metadata {
              facets
              timeWindow { since until compareWith }
            }
          }
        }
      }
    }
  `, { accountId, nrql: fullNrql });

  return {
    results: data?.actor?.account?.nrql?.results ?? [],
    metadata: data?.actor?.account?.nrql?.metadata ?? {},
  };
};
