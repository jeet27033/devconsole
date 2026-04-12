import { defineMessages } from 'react-intl';

export const scope = 'devconsole.components.organisms.DBAuditLog';

export default defineMessages({
  pageTitle: {
    id: `${scope}.pageTitle`,
    defaultMessage: 'DB Audit Log',
  },
  searchPlaceholder: {
    id: `${scope}.searchPlaceholder`,
    defaultMessage: 'Search by ID or Created By...',
  },
  filterByStatus: {
    id: `${scope}.filterByStatus`,
    defaultMessage: 'Filter by Status',
  },
  allStatuses: {
    id: `${scope}.allStatuses`,
    defaultMessage: 'All Statuses',
  },
  columnId: {
    id: `${scope}.columnId`,
    defaultMessage: 'ID',
  },
  columnQuery: {
    id: `${scope}.columnQuery`,
    defaultMessage: 'Query',
  },
  columnCreatedBy: {
    id: `${scope}.columnCreatedBy`,
    defaultMessage: 'Created By',
  },
  columnCreatedOn: {
    id: `${scope}.columnCreatedOn`,
    defaultMessage: 'Created On',
  },
  columnStatus: {
    id: `${scope}.columnStatus`,
    defaultMessage: 'Status',
  },
  columnExecutionTime: {
    id: `${scope}.columnExecutionTime`,
    defaultMessage: 'Execution Time (ms)',
  },
});
