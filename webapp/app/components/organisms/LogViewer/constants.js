export const PRESET_RANGES = [
  { label: 'Last 15 Minutes', value: '15m', amount: 15, unit: 'minutes' },
  { label: 'Last 30 Minutes', value: '30m', amount: 30, unit: 'minutes' },
  { label: 'Last 1 Hour', value: '1h', amount: 60, unit: 'minutes' },
  { label: 'Last 6 Hours', value: '6h', amount: 360, unit: 'minutes' },
  { label: 'Last 24 Hours', value: '24h', amount: 1440, unit: 'minutes' },
  { label: 'Last 48 Hours', value: '48h', amount: 2880, unit: 'minutes' },
];

export const DEFAULT_LOG_LIMIT = 1000;
export const MIN_LOG_LIMIT = 500;

export const SEARCH_OPERATORS = [
  { value: 'contains', label: 'Contains' },
  { value: 'not_contains', label: 'Excludes' },
];
