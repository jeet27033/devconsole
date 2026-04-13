export const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'Active', label: 'Active' },
  { value: 'Closed', label: 'Closed' },
];

export const PRIORITY_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'Critical', label: 'Critical' },
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
];

export const DEFAULT_STATUS = 'Active';

export const ISSUE_TABLE_COLUMNS = [
  {
    title: 'Status',
    subTitle: 'Action taken by',
    dataIndex: 'status',
    width: '34%',
  },
  {
    title: 'Priority',
    dataIndex: 'priority',
    width: '7.5%',
    align: 'center',
  },
  {
    title: 'Triggered',
    dataIndex: 'triggered',
    width: '9.5%',
    align: 'center',
  },
  {
    title: 'Alert condition name',
    subTitle: 'Platform',
    dataIndex: 'conditionName',
    width: '34.5%',
  },
  {
    title: 'Violation duration',
    dataIndex: 'violationDuration',
    width: '8.5%',
    align: 'center',
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    width: '5%',
    align: 'center',
  },
];

export const PRIORITY_COLORS = {
  Critical: '#EA213A',
  High: '#F87D23',
  Medium: '#FFC107',
  Low: '#6c757d',
};
