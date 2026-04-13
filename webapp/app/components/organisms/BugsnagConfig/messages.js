import { defineMessages } from 'react-intl';

export const scope = 'devconsole.components.organisms.BugsnagConfig';

export default defineMessages({
  stabilityTargets: {
    id: `${scope}.stabilityTargets`,
    defaultMessage: 'Stability targets',
  },
  targetStability: {
    id: `${scope}.targetStability`,
    defaultMessage: 'Target Stability',
  },
  targetStabilityTooltip: {
    id: `${scope}.targetStabilityTooltip`,
    defaultMessage: 'The stability level your team aims to maintain',
  },
  criticalStability: {
    id: `${scope}.criticalStability`,
    defaultMessage: 'Critical Stability',
  },
  criticalStabilityTooltip: {
    id: `${scope}.criticalStabilityTooltip`,
    defaultMessage: 'The minimum stability acceptable to your team',
  },
  teamNotifications: {
    id: `${scope}.teamNotifications`,
    defaultMessage: 'Team notifications',
  },
  communicationChannel: {
    id: `${scope}.communicationChannel`,
    defaultMessage: 'Communication channel',
  },
  channel: {
    id: `${scope}.channel`,
    defaultMessage: 'Channel',
  },
  channelPlaceholder: {
    id: `${scope}.channelPlaceholder`,
    defaultMessage: 'Enter channel name',
  },
  webhook: {
    id: `${scope}.webhook`,
    defaultMessage: 'Webhook',
  },
  webhookPlaceholder: {
    id: `${scope}.webhookPlaceholder`,
    defaultMessage: 'Enter webhook url',
  },
  description: {
    id: `${scope}.description`,
    defaultMessage: 'Description',
  },
  descriptionPlaceholder: {
    id: `${scope}.descriptionPlaceholder`,
    defaultMessage: 'Enter description',
  },
  config: {
    id: `${scope}.config`,
    defaultMessage: 'Config',
  },
  spikeInErrors: {
    id: `${scope}.spikeInErrors`,
    defaultMessage: 'Spike in errors',
  },
  spikeTooltip: {
    id: `${scope}.spikeTooltip`,
    defaultMessage: 'A spike is a significant increase in the overall volume of errors.',
  },
  newErrors: {
    id: `${scope}.newErrors`,
    defaultMessage: 'New errors',
  },
  newErrorsTooltip: {
    id: `${scope}.newErrorsTooltip`,
    defaultMessage: 'Get notified when the first event of an error matches the filters, once per release stage.',
  },
  everyErrorOccurs: {
    id: `${scope}.everyErrorOccurs`,
    defaultMessage: 'Every time an error occurs',
  },
  everyErrorTooltip: {
    id: `${scope}.everyErrorTooltip`,
    defaultMessage: 'Send a notification for each individual error occurrence based on chosen criteria.',
  },
  frequentErrors: {
    id: `${scope}.frequentErrors`,
    defaultMessage: 'Frequently occurring errors',
  },
  frequentErrorsTooltip: {
    id: `${scope}.frequentErrorsTooltip`,
    defaultMessage: 'Notify when the same error occurs repeatedly within a specified time period.',
  },
  collaboratorChanges: {
    id: `${scope}.collaboratorChanges`,
    defaultMessage: 'Collaborator changes error state',
  },
  collaboratorTooltip: {
    id: `${scope}.collaboratorTooltip`,
    defaultMessage: 'Receive notifications when team members update the status of an error.',
  },
  newReleases: {
    id: `${scope}.newReleases`,
    defaultMessage: 'New releases',
  },
  newReleasesTooltip: {
    id: `${scope}.newReleasesTooltip`,
    defaultMessage: 'Get notified when new versions of your application are deployed.',
  },
  severity: {
    id: `${scope}.severity`,
    defaultMessage: 'Severity',
  },
  type: {
    id: `${scope}.type`,
    defaultMessage: 'Type',
  },
  errorStatus: {
    id: `${scope}.errorStatus`,
    defaultMessage: 'Error Status',
  },
  unhandledStates: {
    id: `${scope}.unhandledStates`,
    defaultMessage: 'Unhandled States',
  },
  severities: {
    id: `${scope}.severities`,
    defaultMessage: 'Severities',
  },
  threshold: {
    id: `${scope}.threshold`,
    defaultMessage: 'Threshold',
  },
  period: {
    id: `${scope}.period`,
    defaultMessage: 'Period',
  },
  save: {
    id: `${scope}.save`,
    defaultMessage: 'Save',
  },
});
