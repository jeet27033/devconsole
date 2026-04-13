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
});
