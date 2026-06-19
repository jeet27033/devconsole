
import { apiCaller } from '@capillarytech/vulcan-react-sdk/utils';
import endpoints from '../config/endpoints';
import { loginPageUrl } from '../config/path';
import * as requestConstructor from './requestConstructor';
import { i18n, appType, appName } from '../../app-config';
import { IS_PROD } from '../config/constants';
import * as authWrapper from '../utils/authWrapper';
const { getVulcanAPICallObject, getAryaAPICallObject } = requestConstructor;

// const { getAuthenticationDetails } = authWrapper;
// const { orgID } = getAuthenticationDetails();

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

export const getExtensionsBuildHistory = async ()=> {
  const url = `${endpoints.devconsole_endpoint}/extensions/build-history`;
  return httpRequest(url, getVulcanAPICallObject('GET'));
};

export const getExtensionsBuildLogs = async (body) => {
  const url = `${endpoints.devconsole_endpoint}/extensions/build-logs`;
  return httpRequest(url, getVulcanAPICallObject('POST', body));
};

export const getExtensionsBuildMeta = async () => {
  const url = `${endpoints.devconsole_endpoint}/extensions/build-meta`;
  return httpRequest(url, getVulcanAPICallObject('GET'));
};

export const triggerExtensionsBuild = async (body) => {
  const url = `${endpoints.devconsole_endpoint}/extensions/build-trigger`;
  return httpRequest(url, getVulcanAPICallObject('GET', body));
};

export const fetchLokiLogs = async (body) => {
  const url = `${endpoints.devconsole_endpoint}/extensions/log-viewer`;
  return httpRequest(url, getVulcanAPICallObject('POST', body));
};

export const getExtensionsList = async () => {
  const url = `${endpoints.devconsole_endpoint}/extensions/get-extensions`;
  return httpRequest(url, getVulcanAPICallObject('GET'));
};

export const getAppFields = async ({ appName }) => {
  const url = `${endpoints.devconsole_endpoint}/extensions/get-fields?appName=${encodeURIComponent(appName)}`;
  return httpRequest(url, getVulcanAPICallObject('GET'));
};

export const getOrgDBs = async () => {
  const url = `${endpoints.devconsole_endpoint}/extensions/get-dbs`;
  return httpRequest(url, getVulcanAPICallObject('GET'));
};

export const getDBCollections = async ({ db }) => {
  const url = `${endpoints.devconsole_endpoint}/extensions/get-collections?db=${encodeURIComponent(db)}`;
  return httpRequest(url, getVulcanAPICallObject('GET'));
};

export const executeMongoQuery = async (body) => {
  const url = `${endpoints.devconsole_endpoint}/extensions/mongo-query`;
  return httpRequest(url, getVulcanAPICallObject('POST', body));
};

export const getMongoAuditLogs = async ({ status, search, lastId } = {}) => {
  const params = new URLSearchParams();
  if (status && status !== 'all') params.set('status', status);
  if (search) params.set('search', search);
  if (lastId) params.set('lastId', lastId);
  const query = params.toString() ? `?${params.toString()}` : '';
  const url = `${endpoints.devconsole_endpoint}/extensions/mongo-audit-logs${query}`;
  return httpRequest(url, getVulcanAPICallObject('GET'));
};

export const getMongoAuditLogDetail = async ({ id }) => {
  const url = `${endpoints.devconsole_endpoint}/extensions/mongo-audit-logs/${id}`;
  return httpRequest(url, getVulcanAPICallObject('GET'));
};

export const approveMongoAuditLog = async ({ id }) => {
  const url = `${endpoints.devconsole_endpoint}/extensions/mongo-audit-logs/${id}/approve`;
  return httpRequest(url, getVulcanAPICallObject('POST'));
};

export const rejectMongoAuditLog = async ({ id }) => {
  const url = `${endpoints.devconsole_endpoint}/extensions/mongo-audit-logs/${id}/reject`;
  return httpRequest(url, getVulcanAPICallObject('POST'));
};

export const getMongoSchema = async ({ db, collection }) => {
  const url = `${endpoints.devconsole_endpoint}/extensions/mongo-schema?db=${encodeURIComponent(db)}&collection=${encodeURIComponent(collection)}`;
  return httpRequest(url, getVulcanAPICallObject('GET'));
};

export const getConfigData = async (body) => {
  const url = `${endpoints.devconsole_endpoint}/config/get`;
  return httpRequest(url, getVulcanAPICallObject('POST', body));
};

export const saveConfigRequest = async (body) => {
  const url = `${endpoints.devconsole_endpoint}/config/save`;
  return httpRequest(url, getVulcanAPICallObject('POST', body));
};

export const getApplications = async ({ app }) => {
  const url = `${endpoints.devconsole_endpoint}/extensions/get-applications?app=${encodeURIComponent(app)}`;
  return httpRequest(url, getVulcanAPICallObject('GET'));
};

export const getBugsnagIssues = async (query = '') => {
  const url = `${endpoints.devconsole_endpoint}/extensions/bugsnag/issues${query}`;
  return httpRequest(url, getVulcanAPICallObject('GET'));
};

export const updateBugsnagErrorStatus = async (body) => {
  const url = `${endpoints.devconsole_endpoint}/extensions/bugsnag/update-error-status`;
  return httpRequest(url, getVulcanAPICallObject('POST', body));
};

export const getBugsnagConfig = async ({ vulcanApp }) => {
  const url = `${endpoints.devconsole_endpoint}/extensions/bugsnag/config?vulcan_app=${encodeURIComponent(vulcanApp)}`;
  return httpRequest(url, getVulcanAPICallObject('GET'));
};

export const saveBugsnagConfig = async (body) => {
  const url = `${endpoints.devconsole_endpoint}/extensions/bugsnag/config`;
  return httpRequest(url, getVulcanAPICallObject('POST', body));
};

// ── NewRelic Alert Management ──────────────────────────────────────────────────

export const getNewRelicPlatforms = async () => {
  const url = `${endpoints.devconsole_endpoint}/newrelic/platforms`;
  return httpRequest(url, getVulcanAPICallObject('GET'));
};

export const getNewRelicFormMeta = async () => {
  const url = `${endpoints.devconsole_endpoint}/newrelic/form-meta`;
  return httpRequest(url, getVulcanAPICallObject('GET'));
};

export const getNewRelicSettings = async () => {
  const url = `${endpoints.devconsole_endpoint}/newrelic/settings`;
  return httpRequest(url, getVulcanAPICallObject('GET'));
};

export const updateNewRelicSettings = async (body) => {
  const url = `${endpoints.devconsole_endpoint}/newrelic/settings`;
  return httpRequest(url, getVulcanAPICallObject('PUT', body));
};

export const getNewRelicConditions = async (query = '') => {
  const url = `${endpoints.devconsole_endpoint}/newrelic/conditions${query}`;
  return httpRequest(url, getVulcanAPICallObject('GET'));
};

export const getNewRelicConditionDetails = async (id) => {
  const url = `${endpoints.devconsole_endpoint}/newrelic/conditions/${id}`;
  return httpRequest(url, getVulcanAPICallObject('GET'));
};

export const createNewRelicCondition = async (body) => {
  const url = `${endpoints.devconsole_endpoint}/newrelic/conditions`;
  return httpRequest(url, getVulcanAPICallObject('POST', body));
};

export const updateNewRelicCondition = async (id, body) => {
  const url = `${endpoints.devconsole_endpoint}/newrelic/conditions/${id}`;
  return httpRequest(url, getVulcanAPICallObject('PUT', body));
};

export const newRelicConditionAction = async (id, body) => {
  const url = `${endpoints.devconsole_endpoint}/newrelic/conditions/${id}/action`;
  return httpRequest(url, getVulcanAPICallObject('POST', body));
};

export const getNewRelicIssues = async (query = '') => {
  const url = `${endpoints.devconsole_endpoint}/newrelic/issues${query}`;
  return httpRequest(url, getVulcanAPICallObject('GET'));
};

export const newRelicIssueAction = async (id, body) => {
  const url = `${endpoints.devconsole_endpoint}/newrelic/issues/${id}/action`;
  return httpRequest(url, getVulcanAPICallObject('POST', body));
};

export const getNewRelicMetricProducts = async () => {
  const url = `${endpoints.devconsole_endpoint}/newrelic/metric-products`;
  return httpRequest(url, getVulcanAPICallObject('GET'));
};

export const getNewRelicMetricDashboards = async (product) => {
  const url = `${endpoints.devconsole_endpoint}/newrelic/metric-dashboards?product=${encodeURIComponent(product)}`;
  return httpRequest(url, getVulcanAPICallObject('GET'));
};

export const getNewRelicDashboardPages = async (guid) => {
  const url = `${endpoints.devconsole_endpoint}/newrelic/dashboard-pages?guid=${encodeURIComponent(guid)}`;
  return httpRequest(url, getVulcanAPICallObject('GET'));
};

export const executeNewRelicNrql = async (body) => {
  const url = `${endpoints.devconsole_endpoint}/newrelic/nrql`;
  return httpRequest(url, getVulcanAPICallObject('POST', body));
};