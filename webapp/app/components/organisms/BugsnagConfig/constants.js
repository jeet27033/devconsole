export const VULCAN_APPS = [
  { value: 'all', label: 'All Products' },
  { value: 'loyalty-engine', label: 'Loyalty Engine' },
  { value: 'campaign-manager', label: 'Campaign Manager' },
  { value: 'insights-plus', label: 'Insights+' },
  { value: 'engage-plus', label: 'Engage+' },
  { value: 'member-care', label: 'Member Care' },
];

export const COMMUNICATION_CHANNELS = [
  { value: 'slack', label: 'Slack' },
  { value: 'campfire', label: 'Campfire' },
  { value: 'datadog', label: 'Datadog' },
  { value: 'gitter', label: 'Gitter' },
  { value: 'hipchat', label: 'HipChat' },
  { value: 'microsoft-teams', label: 'Microsoft Teams' },
  { value: 'pushed', label: 'Pushed' },
  { value: 'twilio-sms', label: 'Twilio SMS' },
];

export const SEVERITY_OPTIONS = ['error', 'warning', 'info'];

export const TYPE_OPTIONS = [
  { value: 'handled', label: 'Handled' },
  { value: 'unhandled', label: 'Unhandled' },
  { value: 'any', label: 'Any' },
];

export const STATUS_OPTIONS = ['fixed', 'open', 'ignored', 'snoozed'];

export const PERIOD_UNITS = [
  { value: 'm', label: 'Minutes' },
  { value: 'h', label: 'Hours' },
  { value: 'd', label: 'Days' },
];

export const DEFAULT_CONFIG = {
  targetStability: 99.9,
  criticalStability: 99.0,
  notification: {
    channel: '',
    webhook: '',
    description: '',
    type: 'slack',
  },
  projectSpiking: {
    severities: { error: true, warning: false, info: false },
    type: 'any',
    errorStatus: { fixed: false, open: true, ignored: false, snoozed: false },
  },
  firstException: {
    severities: { error: true, warning: false, info: false },
    type: 'any',
    errorStatus: { fixed: false, open: true, ignored: false, snoozed: false },
  },
  exceptionConfig: {
    severities: { error: true, warning: false, info: false },
    type: 'any',
    errorStatus: { fixed: false, open: true, ignored: false, snoozed: false },
  },
  exceptionFrequency: {
    severities: { error: true, warning: false, info: false },
    type: 'any',
    errorStatus: { fixed: false, open: true, ignored: false, snoozed: false },
    threshold: 10,
    periodValue: 1,
    periodUnit: 'd',
  },
  errorStateChange: {
    severities: { error: true, warning: false, info: false },
    type: 'any',
    errorStatus: { fixed: false, open: true, ignored: false, snoozed: false },
  },
};
