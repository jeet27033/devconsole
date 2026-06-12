import { defineActionTypes } from '@capillarytech/vulcan-react-sdk/utils';

export const CONFIG_TABLE_COLUMNS = [
  { title: 'Id', dataIndex: 'id', width: '10%' },
  { title: 'Config Name', dataIndex: 'configName', width: '35%' },
  { title: 'Config Value', dataIndex: 'configValue', width: '55%' },
];

export const REQUEST_TABLE_COLUMNS = [
  { title: 'Id', dataIndex: 'id', width: '6%' },
  { title: 'Config Name', dataIndex: 'configName', width: '18%' },
  { title: 'Config Value', dataIndex: 'configValue', width: '18%' },
  { title: 'Is Secret', dataIndex: 'isSecret', width: '15%' },
  { title: 'Submitted by', dataIndex: 'submittedBy', width: '8%' },
  { title: 'Status', dataIndex: 'status', width: '20%' },
];

export const CONFIG_STATUS = {
  SUCCESS: 'SUCCESS',
  PENDING: 'PENDING',
  REJECTED: 'REJECTED',
};

const scope = '/Components/organisms/ConfigManagement/';

export const REDUCER_KEY = `${CURRENT_APP_NAME}_configManagement`;

export const actionTypes = defineActionTypes(
  {
    GET_CONFIGS_REQUEST: 'GET_CONFIGS_REQUEST',
    GET_CONFIGS_SUCCESS: 'GET_CONFIGS_SUCCESS',
    GET_CONFIGS_FAILURE: 'GET_CONFIGS_FAILURE',

    GET_CONFIG_REQUESTS_REQUEST: 'GET_CONFIG_REQUESTS_REQUEST',
    GET_CONFIG_REQUESTS_SUCCESS: 'GET_CONFIG_REQUESTS_SUCCESS',
    GET_CONFIG_REQUESTS_FAILURE: 'GET_CONFIG_REQUESTS_FAILURE',

    SAVE_CONFIG_REQUEST: 'SAVE_CONFIG_REQUEST',
    SAVE_CONFIG_SUCCESS: 'SAVE_CONFIG_SUCCESS',
    SAVE_CONFIG_FAILURE: 'SAVE_CONFIG_FAILURE',
    RESET_SAVE_CONFIG: 'RESET_SAVE_CONFIG',
  },
  { prefix: CURRENT_APP_NAME, scope },
);
