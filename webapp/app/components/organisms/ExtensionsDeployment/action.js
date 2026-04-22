import { actionTypes } from './constants';

export const getExtensionsBuildHistory = () => ({
  type: actionTypes.GET_EXTENSIONS_BUILD_HISTORY_REQUEST,
});

export const getExtensionsBuildHistorySuccess = data => ({
  type: actionTypes.GET_EXTENSIONS_BUILD_HISTORY_SUCCESS,
  data,
});

export const getExtensionsBuildHistoryFailure = error => ({
  type: actionTypes.GET_EXTENSIONS_BUILD_HISTORY_FAILURE,
  error,
});

export const getExtensionsBuildLogs = payload => ({
  type: actionTypes.GET_EXTENSIONS_BUILD_LOGS_REQUEST,
  payload,
});

export const getExtensionsBuildLogsSuccess = data => ({
  type: actionTypes.GET_EXTENSIONS_BUILD_LOGS_SUCCESS,
  data,
});

export const getExtensionsBuildLogsFailure = error => ({
  type: actionTypes.GET_EXTENSIONS_BUILD_LOGS_FAILURE,
  error,
});

export const clearExtensionsBuildLogs = () => ({
  type: actionTypes.CLEAR_EXTENSIONS_BUILD_LOGS,
});

export const getExtensionsBuildMeta = () => ({
  type: actionTypes.GET_EXTENSIONS_BUILD_META_REQUEST,
});

export const getExtensionsBuildMetaSuccess = data => ({
  type: actionTypes.GET_EXTENSIONS_BUILD_META_SUCCESS,
  data,
});

export const getExtensionsBuildMetaFailure = error => ({
  type: actionTypes.GET_EXTENSIONS_BUILD_META_FAILURE,
  error,
});

export const triggerExtensionsBuild = payload => ({
  type: actionTypes.TRIGGER_EXTENSIONS_BUILD_REQUEST,
  payload,
});

export const triggerExtensionsBuildSuccess = data => ({
  type: actionTypes.TRIGGER_EXTENSIONS_BUILD_SUCCESS,
  data,
});

export const triggerExtensionsBuildFailure = error => ({
  type: actionTypes.TRIGGER_EXTENSIONS_BUILD_FAILURE,
  error,
});

export const resetTriggerExtensionsBuild = () => ({
  type: actionTypes.RESET_TRIGGER_EXTENSIONS_BUILD,
});
