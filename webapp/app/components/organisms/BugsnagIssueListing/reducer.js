import { fromJS } from 'immutable';
import { actionTypes } from './constants';
import { REQUEST, SUCCESS, FAILURE } from '../../pages/App/constants';

const initialState = fromJS({
  apps: [],
  fetchingApps: null,
  issues: [],
  projectId: null,
  fetchingIssues: null,
  issuesError: null,
  updatingStatus: null,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_APPLICATIONS_REQUEST:
      return state.set('fetchingApps', REQUEST);
    case actionTypes.GET_APPLICATIONS_SUCCESS:
      return state.set('fetchingApps', SUCCESS).set('apps', fromJS(action.data || []));
    case actionTypes.GET_APPLICATIONS_FAILURE:
      return state.set('fetchingApps', FAILURE);

    case actionTypes.GET_BUGSNAG_ISSUES_REQUEST:
      return state.set('fetchingIssues', REQUEST).set('issuesError', null);
    case actionTypes.GET_BUGSNAG_ISSUES_SUCCESS:
      return state
        .set('fetchingIssues', SUCCESS)
        .set('issues', fromJS(action.data?.issues || []))
        .set('projectId', action.data?.projectId || null);
    case actionTypes.GET_BUGSNAG_ISSUES_FAILURE:
      return state.set('fetchingIssues', FAILURE).set('issuesError', action.error);

    case actionTypes.UPDATE_BUGSNAG_ERROR_STATUS_REQUEST:
      return state.set('updatingStatus', REQUEST);
    case actionTypes.UPDATE_BUGSNAG_ERROR_STATUS_SUCCESS:
      return state.set('updatingStatus', SUCCESS);
    case actionTypes.UPDATE_BUGSNAG_ERROR_STATUS_FAILURE:
      return state.set('updatingStatus', FAILURE);

    default:
      return state;
  }
};

export default reducer;
