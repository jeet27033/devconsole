import { fromJS } from 'immutable';
import { actionTypes } from './constants';
import { REQUEST, SUCCESS, FAILURE } from '../../pages/App/constants';

const initialState = fromJS({
  auditLogs: [],
  fetchingAuditLogs: null,
  auditLogsError: null,
  auditLogDetail: null,
  fetchingAuditLogDetail: null,
  auditLogDetailError: null,
  approvingAuditLog: null,
  rejectingAuditLog: null,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_MONGO_AUDIT_LOGS_REQUEST:
      return state.set('fetchingAuditLogs', REQUEST).set('auditLogsError', null);
    case actionTypes.GET_MONGO_AUDIT_LOGS_SUCCESS:
      return state.set('fetchingAuditLogs', SUCCESS).set('auditLogs', fromJS(action.data || []));
    case actionTypes.GET_MONGO_AUDIT_LOGS_FAILURE:
      return state.set('fetchingAuditLogs', FAILURE).set('auditLogsError', action.error);
    case actionTypes.GET_MONGO_AUDIT_LOG_DETAIL_REQUEST:
      return state.set('fetchingAuditLogDetail', REQUEST).set('auditLogDetailError', null);
    case actionTypes.GET_MONGO_AUDIT_LOG_DETAIL_SUCCESS:
      return state.set('fetchingAuditLogDetail', SUCCESS).set('auditLogDetail', fromJS(action.data));
    case actionTypes.GET_MONGO_AUDIT_LOG_DETAIL_FAILURE:
      return state.set('fetchingAuditLogDetail', FAILURE).set('auditLogDetailError', action.error);
    case actionTypes.CLEAR_MONGO_AUDIT_LOG_DETAIL:
      return state.set('auditLogDetail', null).set('fetchingAuditLogDetail', null).set('auditLogDetailError', null);

    case actionTypes.APPROVE_MONGO_AUDIT_LOG_REQUEST:
      return state.set('approvingAuditLog', REQUEST);
    case actionTypes.APPROVE_MONGO_AUDIT_LOG_SUCCESS:
      return state.set('approvingAuditLog', SUCCESS)
        .set('auditLogDetail', state.get('auditLogDetail')?.set('status', 'SUCCESS') ?? null);
    case actionTypes.APPROVE_MONGO_AUDIT_LOG_FAILURE:
      return state.set('approvingAuditLog', FAILURE);

    case actionTypes.REJECT_MONGO_AUDIT_LOG_REQUEST:
      return state.set('rejectingAuditLog', REQUEST);
    case actionTypes.REJECT_MONGO_AUDIT_LOG_SUCCESS:
      return state.set('rejectingAuditLog', SUCCESS)
        .set('auditLogDetail', state.get('auditLogDetail')?.set('status', 'REJECTED') ?? null);
    case actionTypes.REJECT_MONGO_AUDIT_LOG_FAILURE:
      return state.set('rejectingAuditLog', FAILURE);

    default:
      return state;
  }
};

export default reducer;
