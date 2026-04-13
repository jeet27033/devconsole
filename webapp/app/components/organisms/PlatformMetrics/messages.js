import { defineMessages } from 'react-intl';

export const scope = 'devconsole.components.organisms.PlatformMetrics';

export default defineMessages({
  selectProduct: {
    id: `${scope}.selectProduct`,
    defaultMessage: 'Select Product',
  },
  selectDashboard: {
    id: `${scope}.selectDashboard`,
    defaultMessage: 'Select Dashboard',
  },
  noDataAvailable: {
    id: `${scope}.noDataAvailable`,
    defaultMessage: 'No data available. Select a product and dashboard to view metrics.',
  },
  refreshDashboard: {
    id: `${scope}.refreshDashboard`,
    defaultMessage: 'Refresh Dashboard',
  },
  loading: {
    id: `${scope}.loading`,
    defaultMessage: 'Loading metrics...',
  },
});
