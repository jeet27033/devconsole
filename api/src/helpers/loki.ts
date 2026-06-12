import logger from './logger';
import {
  LOKI_QUERY_CONFIG,
  LOKI_TIMESTAMP_NS_DIGITS,
} from '../constants/constants';

export type SearchTerm = {
  term: string;
  operator?: 'contains' | 'not_contains';
};
export type SearchInput = string | SearchTerm[] | null | undefined;

export type LokiStream = {
  stream: Record<string, string>;
  values: [string, string][];
};
export type LokiQueryResponse = { data: { result: LokiStream[] } };

export const determineRequestType = (extension: string) => {
  const capillaryPattern = LOKI_QUERY_CONFIG['capillary_extension_pattern'];

  //Only check for @capillarytech extensions - everything else is treated as app
  if (extension && extension.includes(capillaryPattern)) {
    return 'extension';
  }
  return 'app';
};

export const buildExtensionFilter = (extension: string) =>
  `"extension":"${extension.toLowerCase()}"`;

export const getAppConfig = (appName: string) => {
  const appConfigs = LOKI_QUERY_CONFIG.app_configs as any;
  return appConfigs[appName] || LOKI_QUERY_CONFIG.default_config;
};

export const buildOrgFilter = (orgId: number, appName: string) => {
  const orgFilterFormat = getAppConfig(appName).org_filter_format;
  logger.info(`Org filter format: ${orgFilterFormat}`);
  if (!orgId || !orgFilterFormat) {
    return '';
  }
  return orgFilterFormat.replace('{orgId}', String(orgId));
};

export const parseSearchInput = (
  raw: string | null | undefined,
): SearchTerm[] => {
  if (!raw) return [];

  const toTerm = (item: unknown): SearchTerm | null => {
    if (typeof item === 'string' && item.trim()) {
      return { term: item.trim(), operator: 'contains' };
    }
    if (item && typeof item === 'object' && 'term' in item) {
      const term = String((item as any).term ?? '').trim();
      if (!term) return null;
      const operator =
        (item as any).operator === 'not_contains' ? 'not_contains' : 'contains';
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

export const buildSearchFilters = (input: SearchInput): string[] => {
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

export const buildLokiQuery = (
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

export const toLokiNanos = (epoch: number): string =>
  String(epoch).padEnd(LOKI_TIMESTAMP_NS_DIGITS, '0');

export const formatLogTimestamp = (
  nsTimestamp: string,
  timezone: string,
): string =>
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

export const convertLog = (
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
