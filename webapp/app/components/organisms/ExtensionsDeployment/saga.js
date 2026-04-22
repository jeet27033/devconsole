import { call, put, takeLatest } from 'redux-saga/effects';
import * as Api from '../../../services/api';
import { actionTypes } from './constants';

function* getExtensionsBuildHistory() {
  try {
    const res = yield call(Api.getExtensionsBuildHistory);
    if (res?.success) {
      yield put({
        type: actionTypes.GET_EXTENSIONS_BUILD_HISTORY_SUCCESS,
        data: res.result,
      });
    } else {
      yield put({
        type: actionTypes.GET_EXTENSIONS_BUILD_HISTORY_FAILURE,
        error: res?.message || 'Failed to fetch build history',
      });
    }
  } catch (error) {
    yield put({
      type: actionTypes.GET_EXTENSIONS_BUILD_HISTORY_FAILURE,
      error,
    });
  }
}

function* getExtensionsBuildLogs(action) {
  try {
    const res = yield call(Api.getExtensionsBuildLogs, action.payload);
    if (res?.success) {
      const data = res.result?.data ?? res.result ?? '';
      yield put({
        type: actionTypes.GET_EXTENSIONS_BUILD_LOGS_SUCCESS,
        data,
      });
    } else {
      yield put({
        type: actionTypes.GET_EXTENSIONS_BUILD_LOGS_FAILURE,
        error: res?.message || 'Failed to fetch build logs',
      });
    }
  } catch (error) {
    yield put({
      type: actionTypes.GET_EXTENSIONS_BUILD_LOGS_FAILURE,
      error,
    });
  }
}

function* getExtensionsBuildMeta() {
  try {
    const res = yield call(Api.getExtensionsBuildMeta);
    if (res?.success) {
      yield put({
        type: actionTypes.GET_EXTENSIONS_BUILD_META_SUCCESS,
        data: res.result,
      });
    } else {
      yield put({
        type: actionTypes.GET_EXTENSIONS_BUILD_META_FAILURE,
        error: res?.message || 'Failed to fetch build meta data',
      });
    }
  } catch (error) {
    yield put({
      type: actionTypes.GET_EXTENSIONS_BUILD_META_FAILURE,
      error,
    });
  }
}

function* triggerExtensionsBuild(action) {
  try {
    const res = yield call(Api.triggerExtensionsBuild, action.payload);
    if (res?.success) {
      yield put({
        type: actionTypes.TRIGGER_EXTENSIONS_BUILD_SUCCESS,
        data: res.result,
      });
      yield put({ type: actionTypes.GET_EXTENSIONS_BUILD_HISTORY_REQUEST });
    } else {
      yield put({
        type: actionTypes.TRIGGER_EXTENSIONS_BUILD_FAILURE,
        error: res?.message || 'Failed to trigger build',
      });
    }
  } catch (error) {
    yield put({
      type: actionTypes.TRIGGER_EXTENSIONS_BUILD_FAILURE,
      error,
    });
  }
}

function* watchGetExtensionsBuildHistory() {
  yield takeLatest(
    actionTypes.GET_EXTENSIONS_BUILD_HISTORY_REQUEST,
    getExtensionsBuildHistory,
  );
}

function* watchGetExtensionsBuildLogs() {
  yield takeLatest(
    actionTypes.GET_EXTENSIONS_BUILD_LOGS_REQUEST,
    getExtensionsBuildLogs,
  );
}

function* watchGetExtensionsBuildMeta() {
  yield takeLatest(
    actionTypes.GET_EXTENSIONS_BUILD_META_REQUEST,
    getExtensionsBuildMeta,
  );
}

function* watchTriggerExtensionsBuild() {
  yield takeLatest(
    actionTypes.TRIGGER_EXTENSIONS_BUILD_REQUEST,
    triggerExtensionsBuild,
  );
}

export default [
  watchGetExtensionsBuildHistory,
  watchGetExtensionsBuildLogs,
  watchGetExtensionsBuildMeta,
  watchTriggerExtensionsBuild,
];
