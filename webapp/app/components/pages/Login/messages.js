/*
 * Cap Messages
 *
 * This contains all the text for the Login container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'devconsole.components.pages.Login';

export default defineMessages({
  login: {
    id: `${scope}.login`,
    defaultMessage: 'Login',
  },
  loginPage: {
    id: `${scope}.loginPage`,
    defaultMessage: 'Login Page',
  },
  signIn: {
    id: `${scope}.signIn`,
    defaultMessage: 'Sign In!',
  },
  userName: {
    id: `${scope}.userName`,
    defaultMessage: 'User name',
  },
  password: {
    id: `${scope}.password`,
    defaultMessage: 'Password',
  },
});
