import { actionTypes } from './constants';

export const getMongoAuditLogs = (filters = {}) => ({
  type: actionTypes.GET_MONGO_AUDIT_LOGS_REQUEST,
  payload: filters,
});

export const getMongoAuditLogDetail = (id) => ({
  type: actionTypes.GET_MONGO_AUDIT_LOG_DETAIL_REQUEST,
  payload: { id },
});

export const clearMongoAuditLogDetail = () => ({
  type: actionTypes.CLEAR_MONGO_AUDIT_LOG_DETAIL,
});

export const approveMongoAuditLog = (id) => ({
  type: actionTypes.APPROVE_MONGO_AUDIT_LOG_REQUEST,
  payload: { id },
});

export const rejectMongoAuditLog = (id) => ({
  type: actionTypes.REJECT_MONGO_AUDIT_LOG_REQUEST,
  payload: { id },
});
