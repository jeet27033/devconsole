export const PRESET_RANGES = [
  { label: 'Last 5 Minutes', value: 'last_5_minutes', amount: 5, unit: 'minutes' },
  { label: 'Last 30 Minutes', value: 'last_30_minutes', amount: 30, unit: 'minutes' },
  { label: 'Last 1 Hour', value: 'last_1_hour', amount: 60, unit: 'minutes' },
  { label: 'Last 6 Hours', value: 'last_6_hours', amount: 360, unit: 'minutes' },
  { label: 'Last 24 Hours', value: 'last_24_hours', amount: 1440, unit: 'minutes' },
  { label: 'Last 1 Week', value: 'last_1_week', amount: 7, unit: 'days' },
  { label: 'Last 1 Month', value: 'last_1_month', amount: 30, unit: 'days' },
];

export const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const DEFAULT_PRESET = 'last_1_month';

export const DATE_FORMAT = 'DD/MM/YYYY HH:mm:ss';

export const HOURS = Array.from({ length: 24 }, (_, i) => ({
  value: i,
  label: String(i).padStart(2, '0'),
}));

export const MINUTES_SECONDS = Array.from({ length: 60 }, (_, i) => ({
  value: i,
  label: String(i).padStart(2, '0'),
}));
