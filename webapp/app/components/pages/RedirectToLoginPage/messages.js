/*
 * RedirectToLoginPage Messages
 *
 * This contains all the text for the RedirectToLoginPage component.
 */
import { defineMessages } from 'react-intl';
export const scope = 'devconsole.components.pages.RedirectToLoginPage';


export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Redirecting to login page…',
  },
  message: {
    id: `${scope}.message`,
    defaultMessage: 'Looks like your previous session has expired.',
  },
  loginAgainMessage: {
    id: `${scope}.loginAgainMessage`,
    defaultMessage: 'For security reasons, you would have to login again.',
  },
});
