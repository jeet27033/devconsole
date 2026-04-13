import { defineMessages } from 'react-intl';

export const scope = 'devconsole.components.organisms.B2CGatewayConfig';

export default defineMessages({
  clientKeySecretManagement: {
    id: `${scope}.clientKeySecretManagement`,
    defaultMessage: 'Client Key-Secret Management',
  },
  searchByClientKey: {
    id: `${scope}.searchByClientKey`,
    defaultMessage: 'Search by Client Key',
  },
  addClientKeySecret: {
    id: `${scope}.addClientKeySecret`,
    defaultMessage: 'Add Client Key-Secret',
  },
  migrationRequests: {
    id: `${scope}.migrationRequests`,
    defaultMessage: 'Migration Requests',
  },
  whitelistedApis: {
    id: `${scope}.whitelistedApis`,
    defaultMessage: 'Whitelisted APIs',
  },
  searchByApiEndpoint: {
    id: `${scope}.searchByApiEndpoint`,
    defaultMessage: 'Search by API Endpoint',
  },
  addWhitelistedApi: {
    id: `${scope}.addWhitelistedApi`,
    defaultMessage: 'Add Whitelisted API',
  },
  apiRequests: {
    id: `${scope}.apiRequests`,
    defaultMessage: 'API Requests',
  },
  clientKey: {
    id: `${scope}.clientKey`,
    defaultMessage: 'Client Key',
  },
  clientSecret: {
    id: `${scope}.clientSecret`,
    defaultMessage: 'Client Secret',
  },
  accessType: {
    id: `${scope}.accessType`,
    defaultMessage: 'Access Type',
  },
  requestUri: {
    id: `${scope}.requestUri`,
    defaultMessage: 'Request URI',
  },
  requestUriHelp: {
    id: `${scope}.requestUriHelp`,
    defaultMessage: 'Enter the relative URI (e.g. oauthjwt). The URL will be stored as /v2/api/v1/xto6x/execute/{uri}.',
  },
  requestType: {
    id: `${scope}.requestType`,
    defaultMessage: 'Request Type',
  },
  submit: {
    id: `${scope}.submit`,
    defaultMessage: 'Submit',
  },
  cancel: {
    id: `${scope}.cancel`,
    defaultMessage: 'Cancel',
  },
  alreadyComplete: {
    id: `${scope}.alreadyComplete`,
    defaultMessage: 'This organization already has both write and recognized client key-secret pairs. No further addition is allowed.',
  },
  documentationLink: {
    id: `${scope}.documentationLink`,
    defaultMessage: 'Need help? Refer to the B2C Gateway Config Confluence Documentation for setup instructions and workflow details.',
  },
  noKeys: {
    id: `${scope}.noKeys`,
    defaultMessage: 'No client key-secret pairs found.',
  },
  noApis: {
    id: `${scope}.noApis`,
    defaultMessage: 'No whitelisted APIs found.',
  },
});
