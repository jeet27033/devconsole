import { apiCaller } from '@capillarytech/vulcan-react-sdk/utils';
import endpoints from '../config/endpoints';
import { loginPageUrl } from '../config/path';
import * as requestConstructor from './requestConstructor';
import { i18n, appType, appName } from '../../app-config';
import { IS_PROD } from '../config/constants';

const { getVulcanAPICallObject, getAryaAPICallObject } = requestConstructor;

function redirectIfUnauthenticated(response) {
  const { removeAuthenticationDetais } = require('../utils/authWrapper');
  const isUnauthorized = response.status === 401;
  const isLoginPage = window.location.pathname.indexOf('/login') !== -1;
  const isAryaAuthUserCall =
    response.url.split('auth')[1] &&
    response.url.split('auth')[1].split('?')[0] === '/user';
  const isAuthUserCall =
    response.url.split('/api/v1')[1] &&
    response.url.split('/api/v1')[1].split('?')[0] === '/authenticate';
  if (isUnauthorized) {
    if (IS_PROD) {
      removeAuthenticationDetais();
      const isEmbedded = 
        appType !== 'external' && 
        localStorage.getItem(`${appName}__isStandalone`) !== 'true';
      if (isEmbedded) {
        window.location.href = loginPageUrl();
      }
    } else {
      if (isLoginPage && (isAuthUserCall || isAryaAuthUserCall)) return;
      removeAuthenticationDetais();
    }
  }
}

// dummy for prepareVulcanSuccessResponseStructure function

const httpRequest = apiCaller.initializeApiCaller({
  redirectIfUnauthenticated,
  sendVulcanMetricHeaders: true, // config to capture metrics for all calls made, always send this as true
  // skipTimestampQuery: false, // config to skip timestamp query for all, do for individual api calls where required
  // skipRedirectIfUnauthenticated: false, // config to skip the redirection on 401
  // timeout: 60000, // config to set timeout for all api calls, default 1 min, increase if required
  // hideAllErrors: false, // config to hide all errors from api calls, do for individual api calls where required
  // skipParsingJson: false, // config to skip parsing json for all api calls, do for individual api calls where required
  // useResponseCompression: false, // config to use response compression for all api calls, do for individual api calls where required
  // overriddenShowError: function(error, singleErrorOption) {
  //   // return false to suppress error.
  //   // return true to let apiCaller.js handle the notification.
  //   // return an object with message and severity to display a custom message and severity.
  //   // return an object with errorToProcess(Error object) to process the error object.
  //   // Assign singleErrorOption.message to the message property of the object to display a custom message, this will override the default message.
  // sample Error object:
  //    // {
  //    //  status: 404,
  //    //  message: 'Not Found',
  //    //  result: {
  //    //    errorMessage: 'Not Found',
  //    //  },
  //    // }
  //   return true;
  // },
});

export const getLocizeMessage = async locale => {
  const url = `${endpoints.vulcan_endpoint}/translations/${locale}?skipCommonTranslations=false`;
  return httpRequest(url, getVulcanAPICallObject('GET'));
};

export const getSupportedLocales = () => {
  const url = `${endpoints.arya_endpoint}/translations/supportedLocales`;
  return httpRequest(url, getAryaAPICallObject('GET'));
};

export const logout = () => {
  const url = `${endpoints.arya_endpoint}/auth/logout`;
  return httpRequest(url, getAryaAPICallObject('GET'));
};

export const changeProxyOrg = orgId => {
  const url = `${endpoints.arya_endpoint}/auth/setProxy/${orgId}`;
  return httpRequest(url, getAryaAPICallObject('Post'));
};

export const getUserData = async () => {
  const url = `${endpoints.vulcan_endpoint}/authenticate`;
  return httpRequest(url, getVulcanAPICallObject('GET'));
};

// Sample request for calling intouch apis, same can be followed for xaja, extension apis
export const getCustomerData = (customerId) => {
  const url = `${endpoints.vulcan_endpoint}/intouch/v2/customers/${customerId}`;
  return httpRequest(url, getAryaAPICallObject('GET'));
}
