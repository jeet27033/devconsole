import { defineMessages } from 'react-intl';

export const scope = 'devconsole.components.organisms.ConfigManagement';

export default defineMessages({
  searchByConfigName: {
    id: `${scope}.searchByConfigName`,
    defaultMessage: 'Search by Config Name',
  },
  addConfig: {
    id: `${scope}.addConfig`,
    defaultMessage: 'Add Config',
  },
  configRequests: {
    id: `${scope}.configRequests`,
    defaultMessage: 'Config Requests',
  },
  configName: {
    id: `${scope}.configName`,
    defaultMessage: 'Config Name',
  },
  configValue: {
    id: `${scope}.configValue`,
    defaultMessage: 'Config Value',
  },
  isSecret: {
    id: `${scope}.isSecret`,
    defaultMessage: 'Is Secret',
  },
  submit: {
    id: `${scope}.submit`,
    defaultMessage: 'Submit',
  },
  cancel: {
    id: `${scope}.cancel`,
    defaultMessage: 'Cancel',
  },
  overwriteTitle: {
    id: `${scope}.overwriteTitle`,
    defaultMessage: 'Overwrite Config?',
  },
  overwriteMessage: {
    id: `${scope}.overwriteMessage`,
    defaultMessage: 'The value for {configName} already exists and will be overwritten.',
  },
  confirm: {
    id: `${scope}.confirm`,
    defaultMessage: 'Confirm',
  },
  secretsWarning: {
    id: `${scope}.secretsWarning`,
    defaultMessage: 'Please save the secret values, as they will be hidden after approval.',
  },
  noConfigs: {
    id: `${scope}.noConfigs`,
    defaultMessage: 'No configurations found.',
  },
});
