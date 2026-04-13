import { defineMessages } from 'react-intl';

export const scope = 'devconsole.components.organisms.AppRequestLogs';

export default defineMessages({
  selectApplication: {
    id: `${scope}.selectApplication`,
    defaultMessage: 'Select Application',
  },
  addFilter: {
    id: `${scope}.addFilter`,
    defaultMessage: 'Add',
  },
  fetchData: {
    id: `${scope}.fetchData`,
    defaultMessage: 'Fetch Data',
  },
  selectFieldToAdd: {
    id: `${scope}.selectFieldToAdd`,
    defaultMessage: 'Select a field to add',
  },
  filterOptions: {
    id: `${scope}.filterOptions`,
    defaultMessage: 'Filter options for {appName}',
  },
  collapseFilters: {
    id: `${scope}.collapseFilters`,
    defaultMessage: 'Collapse Filters',
  },
  expandFilters: {
    id: `${scope}.expandFilters`,
    defaultMessage: 'Expand Filters',
  },
  noLogs: {
    id: `${scope}.noLogs`,
    defaultMessage: 'No logs found for the selected filters',
  },
  selectApp: {
    id: `${scope}.selectApp`,
    defaultMessage: 'Select an application to view request logs',
  },
  logsFound: {
    id: `${scope}.logsFound`,
    defaultMessage: 'Found {count} log(s).',
  },
  loading: {
    id: `${scope}.loading`,
    defaultMessage: 'Loading...',
  },
  noFiltersSelected: {
    id: `${scope}.noFiltersSelected`,
    defaultMessage: 'No filters selected. Add fields from the dropdown above to filter your results.',
  },
});
