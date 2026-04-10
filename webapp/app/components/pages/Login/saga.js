import {
    call,
    put,
    takeLatest,
  } from 'redux-saga/effects';
import * as Api from '../../../services/api';
import { actionTypes } from './constants';
import {
  setAuthenticationDetails,
  removeAuthenticationDetais,
} from '../../../utils/authWrapper';
import redirectToLogin from '../../../utils/redirectToLogin';
  
  function* logoutFlow({ history }) {
    try {
      const serverLogout = yield call(Api.logout);
      if (serverLogout.success && serverLogout.success === true) {
        yield [put({ type: actionTypes.LOGOUT_SUCCESS })];
        redirectToLogin(history);
      }
    } catch (error) {
      yield put({ type: actionTypes.LOGOUT_FAILURE, error });
    }
  }
  
  function* loginSuccess({ res }) {
    setAuthenticationDetails(res);
  }
  
  function* logoutSuccess() {
    removeAuthenticationDetais();
  }
    
  function* watchForLogoutFlow() {
    yield takeLatest(actionTypes.LOGOUT_REQUEST, logoutFlow);
  }
  
  function* watchForLoginSuccess() {
    yield takeLatest(actionTypes.LOGIN_SUCCESS, loginSuccess);
  }
  
  function* watchForLogoutSuccess() {
    yield takeLatest(actionTypes.LOGOUT_SUCCESS, logoutSuccess);
  }

  
  export default [
    watchForLogoutFlow,
    watchForLogoutSuccess,
    watchForLoginSuccess,
  ];
  