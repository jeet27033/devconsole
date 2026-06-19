import { call, put, takeLatest, all } from 'redux-saga/effects';
import * as Api from '../../../services/api';
import { actionTypes } from './constants';
import { toErrorMessage } from '../../../helper/sagaHelper';

function* getApplications() {
  try {
    const res = yield call(Api.getApplications, { app: 'vulcan' });
    if (res?.success) {
      yield put({ type: actionTypes.GET_APPLICATIONS_SUCCESS, data: res.result });
    } else {
      yield put({ type: actionTypes.GET_APPLICATIONS_FAILURE, error: toErrorMessage(res, 'Failed to fetch applications') });
    }
  } catch (error) {
    yield put({ type: actionTypes.GET_APPLICATIONS_FAILURE, error: toErrorMessage(error, 'Failed to fetch applications') });
  }
}

function* getBugsnagIssues(action) {
  try {
    const { vulcanApp, fromDate, toDate } = action.payload || {};
    const params = new URLSearchParams();
    if (vulcanApp) params.set('vulcan_app', vulcanApp);
    if (fromDate) params.set('from_date', fromDate);
    if (toDate) params.set('to_date', toDate);
    const query = params.toString() ? `?${params.toString()}` : '';
    const res = yield call(Api.getBugsnagIssues, query);
    if (res?.success) {
      yield put({ type: actionTypes.GET_BUGSNAG_ISSUES_SUCCESS, data: res.result });
    } else {
      yield put({ type: actionTypes.GET_BUGSNAG_ISSUES_FAILURE, error: toErrorMessage(res, 'Failed to fetch Bugsnag issues') });
    }
  } catch (error) {
    yield put({ type: actionTypes.GET_BUGSNAG_ISSUES_FAILURE, error: toErrorMessage(error, 'Failed to fetch Bugsnag issues') });
  }
}

function* updateBugsnagErrorStatus(action) {
  try {
    const res = yield call(Api.updateBugsnagErrorStatus, action.payload);
    if (res?.success) {
      yield put({ type: actionTypes.UPDATE_BUGSNAG_ERROR_STATUS_SUCCESS });
      // Re-fetch issues after status update
      yield put({ type: actionTypes.GET_BUGSNAG_ISSUES_REQUEST, payload: action.payload.filters });
    } else {
      yield put({ type: actionTypes.UPDATE_BUGSNAG_ERROR_STATUS_FAILURE, error: toErrorMessage(res, 'Failed to update error status') });
    }
  } catch (error) {
    yield put({ type: actionTypes.UPDATE_BUGSNAG_ERROR_STATUS_FAILURE, error: toErrorMessage(error, 'Failed to update error status') });
  }
}

function* watchGetApplications() {
  yield takeLatest(actionTypes.GET_APPLICATIONS_REQUEST, getApplications);
}

function* watchGetBugsnagIssues() {
  yield takeLatest(actionTypes.GET_BUGSNAG_ISSUES_REQUEST, getBugsnagIssues);
}

function* watchUpdateBugsnagErrorStatus() {
  yield takeLatest(actionTypes.UPDATE_BUGSNAG_ERROR_STATUS_REQUEST, updateBugsnagErrorStatus);
}

export default function* rootSaga() {
  yield all([
    watchGetApplications(),
    watchGetBugsnagIssues(),
    watchUpdateBugsnagErrorStatus(),
  ]);
}
