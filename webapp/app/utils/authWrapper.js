import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect';
import connectedAuthWrapper from 'redux-auth-wrapper/connectedAuthWrapper';
import { LOGIN_URL } from '../config/constants';
import { localStorageApi } from '@capillarytech/vulcan-react-sdk/utils';
import RedirectToLoginPage from '../components/pages/RedirectToLoginPage';

const isLoggedIn = () => {
  let isLoggedIn = false;
  let authenticationToken =
    process.env.NODE_ENV === 'production'
      ? localStorageApi.loadItem('isLoggedIn')
      : localStorageApi.loadItem('token');
  if (authenticationToken) {
    isLoggedIn = true;
  }
  return isLoggedIn;
};

const isNotLoggedIn = () => !isLoggedIn();

const userIsAuthenticatedDefaults = {
  authenticatedSelector: isLoggedIn,
  wrapperDisplayName: 'UserIsAuthenticated',
};

export const userIsAuthenticatedWrapper = connectedAuthWrapper(
  userIsAuthenticatedDefaults,
);

export const userIsAuthenticated = connectedRouterRedirect({
  ...userIsAuthenticatedDefaults,
  redirectPath: LOGIN_URL,
  allowRedirectBack: false,
  FailureComponent: RedirectToLoginPage,
});

export const userIsNotAuthenticated = connectedRouterRedirect({
  redirectPath: '/',
  allowRedirectBack: false,
  authenticatedSelector: isNotLoggedIn,
  wrapperDisplayName: 'UserIsNotAuthenticated',
});

export const setAuthenticationDetails = (res) => {
  if (process.env.NODE_ENV === 'development') {
    localStorageApi.saveItem('token', res.token);
  }
  localStorageApi.saveItem('orgID', res.user.orgID);
  localStorageApi.saveItem('user', res.user);
  localStorageApi.saveItem('isLoggedIn', true);
};

export const removeAuthenticationDetais = () => {
  localStorageApi.clearItem('token');
  localStorageApi.clearItem('orgID');
  localStorageApi.clearItem('user');
  localStorageApi.clearItem('isLoggedIn');
  localStorageApi.clearItem('ouId');
};

export const getAuthenticationDetails = () => ({
  token: localStorageApi.loadItem('token'),
  orgID: localStorageApi.loadItem('orgID'),
  user: localStorageApi.loadItem('user'),
  ouId: localStorageApi.loadItem('ouId'),
});
