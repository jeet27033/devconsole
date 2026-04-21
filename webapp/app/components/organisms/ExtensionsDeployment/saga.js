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

function* watchGetExtensionsBuildHistory() {
  yield takeLatest(
    actionTypes.GET_EXTENSIONS_BUILD_HISTORY_REQUEST,
    getExtensionsBuildHistory,
  );
}

export default [watchGetExtensionsBuildHistory];
