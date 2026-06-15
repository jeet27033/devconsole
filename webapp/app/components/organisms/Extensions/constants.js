import { defineActionTypes } from '@capillarytech/vulcan-react-sdk/utils';

const scope = '/Components/organisms/Extensions/';

export const REDUCER_KEY = `${CURRENT_APP_NAME}_extensions`;

export const actionTypes = defineActionTypes(
  {
    GET_EXTENSIONS_LIST_REQUEST: 'GET_EXTENSIONS_LIST_REQUEST',
    GET_EXTENSIONS_LIST_SUCCESS: 'GET_EXTENSIONS_LIST_SUCCESS',
    GET_EXTENSIONS_LIST_FAILURE: 'GET_EXTENSIONS_LIST_FAILURE',
  },
  { prefix: CURRENT_APP_NAME, scope },
);
