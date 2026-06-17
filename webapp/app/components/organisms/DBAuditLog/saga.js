import { call, put, takeLatest } from 'redux-saga/effects';
import * as Api from '../../../services/api';
import { actionTypes } from './constants';
import { toErrorMessage } from '../../../helper/sagaHelper';

function* getMongoAuditLogs(action) {
  try {
    const res = yield call(Api.getMongoAuditLogs, action.payload);
    if (res?.success) {
      yield put({ type: actionTypes.GET_MONGO_AUDIT_LOGS_SUCCESS, data: res.result });
    } else {
      yield put({ type: actionTypes.GET_MONGO_AUDIT_LOGS_FAILURE, error: toErrorMessage(res, 'Failed to fetch audit logs') });
    }
  } catch (error) {
    yield put({ type: actionTypes.GET_MONGO_AUDIT_LOGS_FAILURE, error: toErrorMessage(error, 'Failed to fetch audit logs') });
  }
}

function* getMongoAuditLogDetail(action) {
  try {
    const res = yield call(Api.getMongoAuditLogDetail, { id: action.payload.id });
    if (res?.success) {
      yield put({ type: actionTypes.GET_MONGO_AUDIT_LOG_DETAIL_SUCCESS, data: res.result });
    } else {
      yield put({ type: actionTypes.GET_MONGO_AUDIT_LOG_DETAIL_FAILURE, error: toErrorMessage(res, 'Failed to fetch detail') });
    }
  } catch (error) {
    yield put({ type: actionTypes.GET_MONGO_AUDIT_LOG_DETAIL_FAILURE, error: toErrorMessage(error, 'Failed to fetch detail') });
  }
}

function* approveMongoAuditLog(action) {
  try {
    const res = yield call(Api.approveMongoAuditLog, { id: action.payload.id });
    if (res?.success) {
      yield put({ type: actionTypes.APPROVE_MONGO_AUDIT_LOG_SUCCESS });
    } else {
      yield put({ type: actionTypes.APPROVE_MONGO_AUDIT_LOG_FAILURE, error: toErrorMessage(res, 'Failed to approve') });
    }
  } catch (error) {
    yield put({ type: actionTypes.APPROVE_MONGO_AUDIT_LOG_FAILURE, error: toErrorMessage(error, 'Failed to approve') });
  }
}

function* rejectMongoAuditLog(action) {
  try {
    const res = yield call(Api.rejectMongoAuditLog, { id: action.payload.id });
    if (res?.success) {
      yield put({ type: actionTypes.REJECT_MONGO_AUDIT_LOG_SUCCESS });
    } else {
      yield put({ type: actionTypes.REJECT_MONGO_AUDIT_LOG_FAILURE, error: toErrorMessage(res, 'Failed to reject') });
    }
  } catch (error) {
    yield put({ type: actionTypes.REJECT_MONGO_AUDIT_LOG_FAILURE, error: toErrorMessage(error, 'Failed to reject') });
  }
}

function* watchGetMongoAuditLogs() {
  yield takeLatest(actionTypes.GET_MONGO_AUDIT_LOGS_REQUEST, getMongoAuditLogs);
}

function* watchGetMongoAuditLogDetail() {
  yield takeLatest(actionTypes.GET_MONGO_AUDIT_LOG_DETAIL_REQUEST, getMongoAuditLogDetail);
}

function* watchApproveMongoAuditLog() {
  yield takeLatest(actionTypes.APPROVE_MONGO_AUDIT_LOG_REQUEST, approveMongoAuditLog);
}

function* watchRejectMongoAuditLog() {
  yield takeLatest(actionTypes.REJECT_MONGO_AUDIT_LOG_REQUEST, rejectMongoAuditLog);
}

export default [watchGetMongoAuditLogs, watchGetMongoAuditLogDetail, watchApproveMongoAuditLog, watchRejectMongoAuditLog];
