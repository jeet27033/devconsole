import { defineActionTypes } from '@capillarytech/vulcan-react-sdk/utils';

export const CONFIG_TABLE_COLUMNS = [
  { title: 'Id', dataIndex: 'id', width: '10%' },
  { title: 'Config Name', dataIndex: 'configName', width: '35%' },
  { title: 'Config Value', dataIndex: 'configValue', width: '55%' },
];

export const REQUEST_TABLE_COLUMNS = [
  { title: '#', dataIndex: 'idx', width: '5%' },
  { title: 'Config Name', dataIndex: 'configName', width: '22%' },
  { title: 'Config Value', dataIndex: 'configValue', width: '25%' },
  { title: 'Secret', dataIndex: 'isSecret', width: '8%' },
  { title: 'Submitted By', dataIndex: 'user', width: '20%' },
  { title: 'Status', dataIndex: 'status', width: '12%' },
  { title: 'Actions', dataIndex: 'actions', width: '8%' },
];

export const CONFIG_STATUS = {
  SUCCESS: 'SUCCESS',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
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
