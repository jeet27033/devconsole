import { call, put, takeLatest } from 'redux-saga/effects';
import * as Api from '../../../services/api';
import { actionTypes } from './constants';
import { toErrorMessage } from '../../../helper/sagaHelper';

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
        error: toErrorMessage(res, 'Failed to fetch extensions list'),
      });
    }
  } catch (error) {
    yield put({
      type: actionTypes.GET_EXTENSIONS_LIST_FAILURE,
      error,
    });
  }
}

function* getAppFields({ appName }) {
  try {
    const res = yield call(Api.getAppFields, { appName });
    if (res?.success) {
      yield put({
        type: actionTypes.GET_APP_FIELDS_SUCCESS,
        data: res.result,
      });
    } else {
      yield put({
        type: actionTypes.GET_APP_FIELDS_FAILURE,
        error: toErrorMessage(res, 'Failed to fetch app fields'),
      });
    }
  } catch (error) {
    yield put({
      type: actionTypes.GET_APP_FIELDS_FAILURE,
      error,
    });
  }
}

function* watchGetExtensionsList() {
  yield takeLatest(actionTypes.GET_EXTENSIONS_LIST_REQUEST, getExtensionsList);
}

function* watchGetAppFields() {
  yield takeLatest(actionTypes.GET_APP_FIELDS_REQUEST, getAppFields);
}

export default [watchGetExtensionsList, watchGetAppFields];
