export const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'Active', label: 'Active' },
  { value: 'Disabled', label: 'Disabled' },
];

export const DEFAULT_STATUS = 'Active';

export const CONDITION_TABLE_COLUMNS = [
  {
    title: 'Alert condition name',
    subTitle: 'Status',
    dataIndex: 'conditionName',
    width: '25%',
  },
  {
    title: 'Platform',
    subTitle: 'App name',
    dataIndex: 'platform',
    width: '15%',
  },
  {
    title: 'Metric to track',
    subTitle: 'Filtered APIs',
    dataIndex: 'metric',
    width: '20%',
  },
  {
    title: 'Threshold',
    dataIndex: 'threshold',
    width: '15%',
  },
  {
    title: 'Last modified on',
    subTitle: 'Modified by',
    dataIndex: 'lastModified',
    width: '15%',
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    width: '5%',
    align: 'center',
  },
];

export const CONDITION_OPERATORS = [
  { value: 'ABOVE', label: 'Above' },
  { value: 'BELOW', label: 'Below' },
  { value: 'EQUALS', label: 'Equals' },
  { value: 'NOT_EQUALS', label: 'Not Equals' },
  { value: 'ABOVE_OR_EQUALS', label: 'Above or Equals' },
  { value: 'BELOW_OR_EQUALS', label: 'Below or Equals' },
];

export const PRIORITY_LEVELS = [
  { value: 'CRITICAL', label: 'Critical' },
  { value: 'WARNING', label: 'Warning' },
];

export const DURATION_TYPES = [
  { value: 'AT_LEAST_ONCE_IN', label: 'at least once in' },
  { value: 'FOR_AT_LEAST', label: 'for at least' },
];

export const TIME_UNITS = [
  { value: 'SECONDS', label: 'Seconds' },
  { value: 'MINUTES', label: 'Minutes' },
  { value: 'HOURS', label: 'Hours' },
  { value: 'DAYS', label: 'Days' },
];

export const DEFAULT_THRESHOLD = {
  priority: 'CRITICAL',
  operator: 'ABOVE',
  value: '',
  durationType: 'AT_LEAST_ONCE_IN',
  durationValue: '',
  timeUnit: 'MINUTES',
};
