import { defineMessages } from 'react-intl';

export const scope = 'devconsole.components.organisms.LogViewer';

export default defineMessages({
  dateTimeRange: {
    id: `${scope}.dateTimeRange`,
    defaultMessage: 'Date/Time Range',
  },
  extension: {
    id: `${scope}.extension`,
    defaultMessage: 'Extension',
  },
  logLimit: {
    id: `${scope}.logLimit`,
    defaultMessage: 'Log Limit',
  },
  searchTerms: {
    id: `${scope}.searchTerms`,
    defaultMessage: 'Search Terms',
  },
  searchLogs: {
    id: `${scope}.searchLogs`,
    defaultMessage: 'Search Logs',
  },
  addSearchTerm: {
    id: `${scope}.addSearchTerm`,
    defaultMessage: 'Add Search Term',
  },
  searchTermHint: {
    id: `${scope}.searchTermHint`,
    defaultMessage: 'Multiple search terms are combined with AND logic (all terms must match)',
  },
  selectExtension: {
    id: `${scope}.selectExtension`,
    defaultMessage: 'Select Extension',
  },
  minLogLimit: {
    id: `${scope}.minLogLimit`,
    defaultMessage: 'Minimum 500',
  },
  noLogsFound: {
    id: `${scope}.noLogsFound`,
    defaultMessage: 'No logs found. Adjust filters and try again.',
  },
  searchPlaceholder: {
    id: `${scope}.searchPlaceholder`,
    defaultMessage: 'Search term',
  },
});
