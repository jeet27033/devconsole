import { call, put, takeLatest } from 'redux-saga/effects';
import * as Api from '../../../services/api';
import { actionTypes, CONFIG_STATUS } from './constants';
import { toErrorMessage } from '../../../helper/sagaHelper';

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
    const status = action.payload?.status ?? CONFIG_STATUS.PENDING_APPROVAL;
    const configName = action.payload?.configName ?? '';
    const res = yield call(Api.getConfigData, { status, configName });
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
      const pendingPayload = { payload: { status: CONFIG_STATUS.PENDING_APPROVAL } };
      if (action_type === 'approve') {
        yield put({ type: actionTypes.GET_CONFIGS_REQUEST });
        yield put({ type: actionTypes.GET_CONFIG_REQUESTS_REQUEST, ...pendingPayload });
      } else {
        yield put({ type: actionTypes.GET_CONFIG_REQUESTS_REQUEST, ...pendingPayload });
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
