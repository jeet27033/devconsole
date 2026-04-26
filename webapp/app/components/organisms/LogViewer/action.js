import { actionTypes } from './constants';

export const fetchLokiLogs = payload => ({
  type: actionTypes.FETCH_LOKI_LOGS_REQUEST,
  payload,
});

export const fetchLokiLogsSuccess = data => ({
  type: actionTypes.FETCH_LOKI_LOGS_SUCCESS,
  data,
});

export const fetchLokiLogsFailure = error => ({
  type: actionTypes.FETCH_LOKI_LOGS_FAILURE,
  error,
});

export const clearLokiLogs = () => ({
  type: actionTypes.CLEAR_LOKI_LOGS,
});

export const getExtensionsList = () => ({
  type: actionTypes.GET_EXTENSIONS_LIST_REQUEST,
});

export const getExtensionsListSuccess = data => ({
  type: actionTypes.GET_EXTENSIONS_LIST_SUCCESS,
  data,
});

export const getExtensionsListFailure = error => ({
  type: actionTypes.GET_EXTENSIONS_LIST_FAILURE,
  error,
});
