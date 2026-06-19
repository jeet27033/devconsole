import { createSelector } from 'reselect';
import { fromJS } from 'immutable';
import { REDUCER_KEY } from './constants';

const initialState = fromJS({
  apps: [],
  fetchingApps: null,
  issues: [],
  projectId: null,
  fetchingIssues: null,
  issuesError: null,
  updatingStatus: null,
});

const selectDomain = (state) => state.get(REDUCER_KEY, initialState);

export const makeSelectApps = () =>
  createSelector(selectDomain, (s) => s.get('apps')?.toJS() || []);

export const makeSelectFetchingApps = () =>
  createSelector(selectDomain, (s) => s.get('fetchingApps'));

export const makeSelectIssues = () =>
  createSelector(selectDomain, (s) => s.get('issues')?.toJS() || []);

export const makeSelectProjectId = () =>
  createSelector(selectDomain, (s) => s.get('projectId'));

export const makeSelectFetchingIssues = () =>
  createSelector(selectDomain, (s) => s.get('fetchingIssues'));

export const makeSelectIssuesError = () =>
  createSelector(selectDomain, (s) => s.get('issuesError'));

export const makeSelectUpdatingStatus = () =>
  createSelector(selectDomain, (s) => s.get('updatingStatus'));
