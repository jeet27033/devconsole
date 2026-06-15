import { defineActionTypes } from '@capillarytech/vulcan-react-sdk/utils';

export const SEARCH_TYPES = [
  { value: 'exact', label: 'Exact' },
  { value: 'like', label: 'LIKE' },
];

export const MAX_DATE_RANGE_HOURS = 48;
export const MAX_DATE_RANGE_DAYS = 30;

const scope = '/Components/organisms/AppRequestLogs/';

export const REDUCER_KEY = `${CURRENT_APP_NAME}_appRequestLogs`;

export const actionTypes = defineActionTypes(
  {
    GET_EXTENSIONS_LIST_REQUEST: 'GET_EXTENSIONS_LIST_REQUEST',
    GET_EXTENSIONS_LIST_SUCCESS: 'GET_EXTENSIONS_LIST_SUCCESS',
    GET_EXTENSIONS_LIST_FAILURE: 'GET_EXTENSIONS_LIST_FAILURE',
    GET_APP_FIELDS_REQUEST: 'GET_APP_FIELDS_REQUEST',
    GET_APP_FIELDS_SUCCESS: 'GET_APP_FIELDS_SUCCESS',
    GET_APP_FIELDS_FAILURE: 'GET_APP_FIELDS_FAILURE',
  },
  { prefix: CURRENT_APP_NAME, scope },
);
