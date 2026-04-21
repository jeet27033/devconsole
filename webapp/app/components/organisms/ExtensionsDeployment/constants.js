import { defineActionTypes } from '@capillarytech/vulcan-react-sdk/utils';

const scope = '/Components/organisms/ExtensionsDeployment/';

export const REDUCER_KEY = `${CURRENT_APP_NAME}_extensionsDeployment`;

export const actionTypes = defineActionTypes(
  {
    GET_EXTENSIONS_BUILD_HISTORY_REQUEST: 'GET_EXTENSIONS_BUILD_HISTORY_REQUEST',
    GET_EXTENSIONS_BUILD_HISTORY_SUCCESS: 'GET_EXTENSIONS_BUILD_HISTORY_SUCCESS',
    GET_EXTENSIONS_BUILD_HISTORY_FAILURE: 'GET_EXTENSIONS_BUILD_HISTORY_FAILURE',
  },
  { prefix: CURRENT_APP_NAME, scope },
);
