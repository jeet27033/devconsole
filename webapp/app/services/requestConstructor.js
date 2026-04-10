import get from 'lodash/get';
import { appId, isHostedOnPlatform } from '../../app-config';

const isProd = process.env.NODE_ENV === 'production';

/**
 * Retrieves common headers for API calls.
 * @param {boolean} isFileUpload - Indicates if the API call is for file upload.
 * @param {object} apiConfigs - Additional API configurations.
 * @returns {object} - Common headers object.
 */
function getCommonHeaders(isFileUpload, apiConfigs) {
  const { getAuthenticationDetails } = require('../utils/authWrapper');
  const { token, orgID, user, ouId } = getAuthenticationDetails();

  let headers = isFileUpload ? {} : { 'Content-Type': 'application/json' };

  if (user?.refID) {
    headers['X-CAP-REMOTE-USER'] = user.refID;
  }

  if (!isProd && orgID !== undefined) {
    headers['X-CAP-API-AUTH-ORG-ID'] = orgID;
  }

  if (ouId !== undefined) {
    headers['x-cap-api-auth-ou-id'] = ouId;
  }

  if (!isProd && token !== undefined) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (get(apiConfigs, 'headers')) {
    headers = { ...headers, ...apiConfigs.headers };
  }

  return headers;
}

/**
 * Constructs an API call object.
 * @param {string} method - HTTP method for the API call (e.g., GET, POST).
 * @param {object} body - Body of the request.
 * @param {object} options - Additional options for the API call.
 * @param {boolean} [options.isFileUpload=false] - Indicates if the API call is for file upload.
 * @param {object} [options.apiConfigs={}] - Additional API configurations.
 * @param {string} [options.type] - Type of API call.
 * @param {boolean} [options.useResponseCompression=false] - Indicates if the response should be compressed.
 * @returns {object} - API call object.
 */
export function getAPICallObject(method, body, options = {}) {
  const { isFileUpload = false, apiConfigs = {}, type, useResponseCompression = false } = options;
  const headers = getCommonHeaders(isFileUpload, apiConfigs);

  switch (type) {
    case 'vulcan':
      if (isHostedOnPlatform) {
        if (!appId) {
          console.error('App Id is not found in app-config');
        }
        headers['x-cap-vulcan-app-id'] = appId;
      }
      break;
    // Add more cases as needed for different types
    default:
      break;
  }

  const requestObj = {
    method,
    mode: 'cors',
    headers: new Headers(headers),
    credentials: isProd ? 'include' : undefined,
    body: isFileUpload ? body : JSON.stringify(body),
    useResponseCompression,
  };

  return requestObj;
}

/**
 * Constructs an Arya API call object.
 * @param {string} method - HTTP method for the API call (e.g., GET, POST).
 * @param {object} body - Body of the request.
 * @param {object} options - Additional options for the API call.
 * @param {boolean} [options.isFileUpload=false] - Indicates if the API call is for file upload.
 * @param {object} [options.apiConfigs={}] - Additional API configurations.
 * @param {boolean} [options.useResponseCompression=false] - Indicates if the response should be compressed.
 * @returns {object} - Arya API call object.
 */
export function getAryaAPICallObject(method, body, options = {}) {
  const { isFileUpload = false, apiConfigs = {}, useResponseCompression = false } = options;
  return getAPICallObject(method, body, {
    isFileUpload,
    apiConfigs,
    type: 'arya',
    useResponseCompression,
  });
}

/**
 * Constructs a Vulcan API call object.
 * @param {string} method - HTTP method for the API call (e.g., GET, POST).
 * @param {object} body - Body of the request.
 * @param {object} options - Additional options for the API call.
 * @param {boolean} [options.isFileUpload=false] - Indicates if the API call is for file upload.
 * @param {object} [options.apiConfigs={}] - Additional API configurations.
 * @param {boolean} [options.useResponseCompression=false] - Indicates if the response should be compressed.
 * @returns {object} - Vulcan API call object.
 */
export function getVulcanAPICallObject(method, body, options = {}) {
  const { isFileUpload = false, apiConfigs = {}, useResponseCompression = false } = options;
  return getAPICallObject(method, body, {
    isFileUpload,
    apiConfigs,
    type: 'vulcan',
    useResponseCompression,
  });
}

// Add more functions for other types if needed
// export function getOtherTypeAPICallObject(method, body, options = {}) {
//   const { isFileUpload = false, apiConfigs = {} } = options;
//   return getAPICallObject(method, body, isFileUpload, apiConfigs, 'otherType');
// }
