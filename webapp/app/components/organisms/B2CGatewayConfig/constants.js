export const KEY_TABLE_COLUMNS = [
  { title: 'Id', dataIndex: 'id', width: '8%' },
  { title: 'Client Key', dataIndex: 'clientKey', width: '25%' },
  { title: 'Client Secret', dataIndex: 'clientSecret', width: '27%' },
  { title: 'Access Type', dataIndex: 'accessType', width: '15%' },
  { title: 'Status', dataIndex: 'status', width: '10%' },
];

export const WHITELISTED_API_COLUMNS = [
  { title: 'Id', dataIndex: 'id', width: '8%' },
  { title: 'Relative URL', dataIndex: 'relativeUrl', width: '60%' },
  { title: 'Request Type', dataIndex: 'requestType', width: '20%' },
];

export const ACCESS_TYPES = [
  { value: '', label: 'Select Access Type' },
  { value: 'write', label: 'Write' },
  { value: 'recognized', label: 'Recognized' },
];

export const REQUEST_TYPES = [
  { value: '', label: 'Select Request Type' },
  { value: 'GET', label: 'GET' },
  { value: 'POST', label: 'POST' },
  { value: 'PUT', label: 'PUT' },
  { value: 'DELETE', label: 'DELETE' },
  { value: 'PATCH', label: 'PATCH' },
];

export const MIGRATION_REQUEST_COLUMNS = [
  { title: 'Id', dataIndex: 'id', width: '6%' },
  { title: 'Client Key', dataIndex: 'clientKey', width: '18%' },
  { title: 'Client Secret', dataIndex: 'clientSecret', width: '18%' },
  { title: 'Access Type', dataIndex: 'accessType', width: '12%' },
  { title: 'Submitted by', dataIndex: 'submittedBy', width: '10%' },
  { title: 'Approved by', dataIndex: 'approvedBy', width: '10%' },
  { title: 'Status', dataIndex: 'status', width: '26%' },
];

export const API_REQUEST_COLUMNS = [
  { title: 'Id', dataIndex: 'id', width: '6%' },
  { title: 'Relative URL', dataIndex: 'relativeUrl', width: '30%' },
  { title: 'Request Type', dataIndex: 'requestType', width: '12%' },
  { title: 'Submitted by', dataIndex: 'submittedBy', width: '10%' },
  { title: 'Approved by', dataIndex: 'approvedBy', width: '10%' },
  { title: 'Status', dataIndex: 'status', width: '32%' },
];

export const CONFLUENCE_DOC_URL =
  'https://capillarytech.atlassian.net/wiki/x/B4A2PAE';
