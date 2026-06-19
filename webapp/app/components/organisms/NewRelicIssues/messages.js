import { defineMessages } from 'react-intl';

export const scope = 'devconsole.components.organisms.NewRelicIssues';

export default defineMessages({
  searchPlaceholder: {
    id: `${scope}.searchPlaceholder`,
    defaultMessage: 'Search by alert condition name',
  },
  acknowledge: {
    id: `${scope}.acknowledge`,
    defaultMessage: 'Acknowledge this issue',
  },
  unacknowledge: {
    id: `${scope}.unacknowledge`,
    defaultMessage: 'Unacknowledge this issue',
  },
  closeIssue: {
    id: `${scope}.closeIssue`,
    defaultMessage: 'Close this issue',
  },
  closeIssueTitle: {
    id: `${scope}.closeIssueTitle`,
    defaultMessage: 'Close issue',
  },
  closeIssueConfirm: {
    id: `${scope}.closeIssueConfirm`,
    defaultMessage: 'Please make sure you\'ve assessed the issue and taken the necessary steps to troubleshoot before closing this issue as it cannot be marked as active again.',
  },
  areYouSure: {
    id: `${scope}.areYouSure`,
    defaultMessage: 'Are you sure?',
  },
  yesClose: {
    id: `${scope}.yesClose`,
    defaultMessage: 'Yes, close this issue',
  },
  cancel: {
    id: `${scope}.cancel`,
    defaultMessage: 'Cancel',
  },
  noIssues: {
    id: `${scope}.noIssues`,
    defaultMessage: 'No issues found.',
  },
  acknowledgedBy: {
    id: `${scope}.acknowledgedBy`,
    defaultMessage: 'Acknowledged by {user}',
  },
  search: {
    id: `${scope}.search`,
    defaultMessage: 'Search',
  },
  dateTimeRange: {
    id: `${scope}.dateTimeRange`,
    defaultMessage: 'Date / Time Range',
  },
  status: {
    id: `${scope}.status`,
    defaultMessage: 'Status',
  },
  priority: {
    id: `${scope}.priority`,
    defaultMessage: 'Priority',
  },
  platform: {
    id: `${scope}.platform`,
    defaultMessage: 'Platform',
  },
});
