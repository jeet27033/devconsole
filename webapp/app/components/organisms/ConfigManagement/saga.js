import { call, put, takeLatest } from 'redux-saga/effects';
import * as Api from '../../../services/api';
import { actionTypes, CONFIG_STATUS } from './constants';

const toErrorMessage = (err, fallback) => {
  if (!err) return fallback;
  if (typeof err === 'string') return err;
  if (err.message) return err.message;
  if (err.error) return err.error;
  return fallback;
};

function* getConfigs(action) {
  try {
    const status = action.payload?.status ?? CONFIG_STATUS.SUCCESS;
    const res = yield call(Api.getConfigData, { status });
    if (res?.success) {
      yield put({
        type: actionTypes.GET_CONFIGS_SUCCESS,
        data: res.result,
      });
    } else {
      yield put({
        type: actionTypes.GET_CONFIGS_FAILURE,
        error: toErrorMessage(res, 'Failed to fetch configs'),
      });
    }
  } catch (error) {
    yield put({
      type: actionTypes.GET_CONFIGS_FAILURE,
      error: toErrorMessage(error, 'Failed to fetch configs'),
    });
  }
}

function* getConfigRequests(action) {
  try {
    const status = action.payload?.status ?? CONFIG_STATUS.PENDING;
    const res = yield call(Api.getConfigData, { status });
    if (res?.success) {
      yield put({
        type: actionTypes.GET_CONFIG_REQUESTS_SUCCESS,
        data: res.result,
      });
    } else {
      yield put({
        type: actionTypes.GET_CONFIG_REQUESTS_FAILURE,
        error: toErrorMessage(res, 'Failed to fetch config requests'),
      });
    }
  } catch (error) {
    yield put({
      type: actionTypes.GET_CONFIG_REQUESTS_FAILURE,
      error: toErrorMessage(error, 'Failed to fetch config requests'),
    });
  }
}

function* saveConfig(action) {
  try {
    const res = yield call(Api.saveConfigRequest, action.payload);
    if (res?.success) {
      yield put({
        type: actionTypes.SAVE_CONFIG_SUCCESS,
        data: res.result,
      });
      const action_type = action.payload?.action;
      if (action_type === 'approve') {
        yield put({ type: actionTypes.GET_CONFIGS_REQUEST });
        yield put({ type: actionTypes.GET_CONFIG_REQUESTS_REQUEST });
      } else if (action_type === 'reject') {
        yield put({ type: actionTypes.GET_CONFIG_REQUESTS_REQUEST });
      } else {
        yield put({ type: actionTypes.GET_CONFIG_REQUESTS_REQUEST });
      }
    } else {
      yield put({
        type: actionTypes.SAVE_CONFIG_FAILURE,
        error: toErrorMessage(res, 'Failed to save config'),
      });
    }
  } catch (error) {
    yield put({
      type: actionTypes.SAVE_CONFIG_FAILURE,
      error: toErrorMessage(error, 'Failed to save config'),
    });
  }
}

function* watchGetConfigs() {
  yield takeLatest(actionTypes.GET_CONFIGS_REQUEST, getConfigs);
}

function* watchGetConfigRequests() {
  yield takeLatest(actionTypes.GET_CONFIG_REQUESTS_REQUEST, getConfigRequests);
}

function* watchSaveConfig() {
  yield takeLatest(actionTypes.SAVE_CONFIG_REQUEST, saveConfig);
}

export default [watchGetConfigs, watchGetConfigRequests, watchSaveConfig];
