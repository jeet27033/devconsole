import { call, put, takeLatest } from 'redux-saga/effects';
import * as Api from '../../../services/api';
import { actionTypes } from './constants';

const toErrorMessage = (err, fallback) => {
  if (!err) return fallback;
  if (typeof err === 'string') return err;
  if (err.message) return err.message;
  if (err.error) return err.error;
  return fallback;
};

function* fetchLokiLogs(action) {
  try {
    const res = yield call(Api.fetchLokiLogs, action.payload);
    if (res?.success) {
      yield put({
        type: actionTypes.FETCH_LOKI_LOGS_SUCCESS,
        data: res.result,
      });
    } else {
      yield put({
        type: actionTypes.FETCH_LOKI_LOGS_FAILURE,
        error: toErrorMessage(res, 'Failed to fetch logs'),
      });
    }
  } catch (error) {
    yield put({
      type: actionTypes.FETCH_LOKI_LOGS_FAILURE,
      error: toErrorMessage(error, 'Failed to fetch logs'),
    });
  }
}

function* getExtensionsList() {
  try {
    const res = yield call(Api.getExtensionsList);
    if (res?.success) {
      yield put({
        type: actionTypes.GET_EXTENSIONS_LIST_SUCCESS,
        data: res.result,
      });
    } else {
      yield put({
        type: actionTypes.GET_EXTENSIONS_LIST_FAILURE,
        error: res?.message || 'Failed to fetch extensions list',
      });
    }
  } catch (error) {
    yield put({
      type: actionTypes.GET_EXTENSIONS_LIST_FAILURE,
      error,
    });
  }
}

function* watchFetchLokiLogs() {
  yield takeLatest(actionTypes.FETCH_LOKI_LOGS_REQUEST, fetchLokiLogs);
}

function* watchGetExtensionsList() {
  yield takeLatest(actionTypes.GET_EXTENSIONS_LIST_REQUEST, getExtensionsList);
}

export default [watchFetchLokiLogs, watchGetExtensionsList];
