import { actionTypes } from './constants';

export const getApplications = () => ({
  type: actionTypes.GET_APPLICATIONS_REQUEST,
});

export const getBugsnagIssues = (filters = {}) => ({
  type: actionTypes.GET_BUGSNAG_ISSUES_REQUEST,
  payload: filters,
});

export const updateBugsnagErrorStatus = (payload) => ({
  type: actionTypes.UPDATE_BUGSNAG_ERROR_STATUS_REQUEST,
  payload,
});
