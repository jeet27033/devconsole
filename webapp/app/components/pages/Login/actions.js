import { actionTypes } from './constants';

export const logout = (history) => ({
  type: actionTypes.LOGOUT_REQUEST,
  history,
});

export const loginSuccess = res => ({
  type: actionTypes.LOGIN_SUCCESS,
  res,
});

export const loginFailure = error => ({
  type: actionTypes.LOGIN_FAILURE,
  error,
});
