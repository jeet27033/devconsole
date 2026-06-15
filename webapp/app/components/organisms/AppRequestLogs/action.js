import { actionTypes } from './constants';

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

export const getAppFields = appName => ({
  type: actionTypes.GET_APP_FIELDS_REQUEST,
  appName,
});

export const getAppFieldsSuccess = data => ({
  type: actionTypes.GET_APP_FIELDS_SUCCESS,
  data,
});

export const getAppFieldsFailure = error => ({
  type: actionTypes.GET_APP_FIELDS_FAILURE,
  error,
});
