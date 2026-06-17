import { createSelector } from 'reselect';
import { fromJS } from 'immutable';
import { REDUCER_KEY } from './constants';

const initialState = fromJS({
  auditLogs: [],
  fetchingAuditLogs: null,
  auditLogsError: null,
});

const selectDomain = (state) => state.get(REDUCER_KEY, initialState);

export const makeSelectAuditLogs = () =>
  createSelector(selectDomain, (s) => s.get('auditLogs')?.toJS() || []);

export const makeSelectFetchingAuditLogs = () =>
  createSelector(selectDomain, (s) => s.get('fetchingAuditLogs'));

export const makeSelectAuditLogsError = () =>
  createSelector(selectDomain, (s) => s.get('auditLogsError'));

export const makeSelectAuditLogDetail = () =>
  createSelector(selectDomain, (s) => s.get('auditLogDetail')?.toJS() ?? null);

export const makeSelectFetchingAuditLogDetail = () =>
  createSelector(selectDomain, (s) => s.get('fetchingAuditLogDetail'));

export const makeSelectAuditLogDetailError = () =>
  createSelector(selectDomain, (s) => s.get('auditLogDetailError'));

export const makeSelectApprovingAuditLog = () =>
  createSelector(selectDomain, (s) => s.get('approvingAuditLog'));

export const makeSelectRejectingAuditLog = () =>
  createSelector(selectDomain, (s) => s.get('rejectingAuditLog'));
