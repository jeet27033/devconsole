import { actionTypes } from './constants';

export const getExtensionsBuildHistory = () => {
  console.log('[DEBUG action] getExtensionsBuildHistory action creator called, type:', actionTypes.GET_EXTENSIONS_BUILD_HISTORY_REQUEST);
  return {
    type: actionTypes.GET_EXTENSIONS_BUILD_HISTORY_REQUEST,
  };
};

export const getExtensionsBuildHistorySuccess = data => ({
  type: actionTypes.GET_EXTENSIONS_BUILD_HISTORY_SUCCESS,
  data,
});

export const getExtensionsBuildHistoryFailure = error => ({
  type: actionTypes.GET_EXTENSIONS_BUILD_HISTORY_FAILURE,
  error,
});
