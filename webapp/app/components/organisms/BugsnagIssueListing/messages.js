import { defineMessages } from 'react-intl';

export const scope = 'devconsole.components.organisms.BugsnagIssueListing';

export default defineMessages({
  columnDetails: {
    id: `${scope}.columnDetails`,
    defaultMessage: 'Details',
  },
  columnEvents: {
    id: `${scope}.columnEvents`,
    defaultMessage: 'Events',
  },
  columnUsers: {
    id: `${scope}.columnUsers`,
    defaultMessage: 'Users',
  },
  columnSeverity: {
    id: `${scope}.columnSeverity`,
    defaultMessage: 'Severity',
  },
  columnLastSeen: {
    id: `${scope}.columnLastSeen`,
    defaultMessage: 'Last seen',
  },
  appPlaceholder: {
    id: `${scope}.appPlaceholder`,
    defaultMessage: 'All Products',
  },
  dateTimeRange: {
    id: `${scope}.dateTimeRange`,
    defaultMessage: 'Date / Time Range',
  },
  application: {
    id: `${scope}.application`,
    defaultMessage: 'Application',
  },
  columnActions: {
    id: `${scope}.columnActions`,
    defaultMessage: '',
  },
  noErrors: {
    id: `${scope}.noErrors`,
    defaultMessage: 'No errors found',
  },
  actionOpen: {
    id: `${scope}.actionOpen`,
    defaultMessage: 'Open',
  },
  actionFixed: {
    id: `${scope}.actionFixed`,
    defaultMessage: 'Fixed',
  },
  actionIgnored: {
    id: `${scope}.actionIgnored`,
    defaultMessage: 'Ignored',
  },
  noVulcanApps: {
    id: `${scope}.noVulcanApps`,
    defaultMessage: 'No Vulcan apps available for this organization',
  },
});
