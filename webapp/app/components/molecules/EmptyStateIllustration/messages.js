/*
 * EmptyStateIllustration Messages
 *
 * This contains all the text for the EmptyStateIllustration component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'devconsole.components.molecules.EmptyStateIllustration';

export default defineMessages({
  nothingConfigured: {
    id: `${scope}.nothingConfigured`,
    defaultMessage: 'Nothing configured till now',
  },
  nothingConfiguredDesc: {
    id: `${scope}.nothingConfiguredDesc`,
    defaultMessage:
      'Looks like there is no data available for this program. If you think this is an error, please contact support',
  },
});
