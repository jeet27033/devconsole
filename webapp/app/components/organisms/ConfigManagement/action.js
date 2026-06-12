import { actionTypes } from './constants';

export const getConfigs = payload => ({
  type: actionTypes.GET_CONFIGS_REQUEST,
  payload,
});

export const getConfigsSuccess = data => ({
  type: actionTypes.GET_CONFIGS_SUCCESS,
  data,
});

export const getConfigsFailure = error => ({
  type: actionTypes.GET_CONFIGS_FAILURE,
  error,
});

export const getConfigRequests = payload => ({
  type: actionTypes.GET_CONFIG_REQUESTS_REQUEST,
  payload,
});

export const getConfigRequestsSuccess = data => ({
  type: actionTypes.GET_CONFIG_REQUESTS_SUCCESS,
  data,
});

export const getConfigRequestsFailure = error => ({
  type: actionTypes.GET_CONFIG_REQUESTS_FAILURE,
  error,
});

export const saveConfig = payload => ({
  type: actionTypes.SAVE_CONFIG_REQUEST,
  payload,
});

export const saveConfigSuccess = data => ({
  type: actionTypes.SAVE_CONFIG_SUCCESS,
  data,
});

export const saveConfigFailure = error => ({
  type: actionTypes.SAVE_CONFIG_FAILURE,
  error,
});

export const resetSaveConfig = () => ({
  type: actionTypes.RESET_SAVE_CONFIG,
});
