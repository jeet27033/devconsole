import { defineMessages } from 'react-intl';

export const scope = 'devconsole.components.organisms.NewRelicConfigurations';

export default defineMessages({
  searchPlaceholder: {
    id: `${scope}.searchPlaceholder`,
    defaultMessage: 'Search by alert condition name',
  },
  newAlertCondition: {
    id: `${scope}.newAlertCondition`,
    defaultMessage: 'New Alert Condition',
  },
  settings: {
    id: `${scope}.settings`,
    defaultMessage: 'Settings',
  },
  conditionName: {
    id: `${scope}.conditionName`,
    defaultMessage: 'Alert condition name',
  },
  conditionNamePlaceholder: {
    id: `${scope}.conditionNamePlaceholder`,
    defaultMessage: 'Enter alert condition name (10-50 characters)',
  },
  defineConditions: {
    id: `${scope}.defineConditions`,
    defaultMessage: 'Define Alert Conditions',
  },
  selectPlatform: {
    id: `${scope}.selectPlatform`,
    defaultMessage: 'Select Platform / Application',
  },
  selectMetric: {
    id: `${scope}.selectMetric`,
    defaultMessage: 'Metric to track',
  },
  filterScope: {
    id: `${scope}.filterScope`,
    defaultMessage: 'Filter scope',
  },
  filterByApis: {
    id: `${scope}.filterByApis`,
    defaultMessage: 'Filter by APIs',
  },
  setThresholds: {
    id: `${scope}.setThresholds`,
    defaultMessage: 'Set thresholds',
  },
  addThreshold: {
    id: `${scope}.addThreshold`,
    defaultMessage: 'Add threshold',
  },
  removeThreshold: {
    id: `${scope}.removeThreshold`,
    defaultMessage: 'Remove',
  },
  customizeNotification: {
    id: `${scope}.customizeNotification`,
    defaultMessage: 'Customize notification template (Optional)',
  },
  notificationTitle: {
    id: `${scope}.notificationTitle`,
    defaultMessage: 'Title',
  },
  notificationDescription: {
    id: `${scope}.notificationDescription`,
    defaultMessage: 'Description',
  },
  resetTemplate: {
    id: `${scope}.resetTemplate`,
    defaultMessage: 'Reset to default',
  },
  create: {
    id: `${scope}.create`,
    defaultMessage: 'Create',
  },
  update: {
    id: `${scope}.update`,
    defaultMessage: 'Update',
  },
  cancel: {
    id: `${scope}.cancel`,
    defaultMessage: 'Cancel',
  },
  deleteCondition: {
    id: `${scope}.deleteCondition`,
    defaultMessage: 'Delete',
  },
  editCondition: {
    id: `${scope}.editCondition`,
    defaultMessage: 'Edit',
  },
  enableCondition: {
    id: `${scope}.enableCondition`,
    defaultMessage: 'Enable',
  },
  disableCondition: {
    id: `${scope}.disableCondition`,
    defaultMessage: 'Disable',
  },
  noConditions: {
    id: `${scope}.noConditions`,
    defaultMessage: 'No alert conditions found.',
  },
  slackWebhookUrl: {
    id: `${scope}.slackWebhookUrl`,
    defaultMessage: 'Slack Webhook URL',
  },
  save: {
    id: `${scope}.save`,
    defaultMessage: 'Save',
  },
});
