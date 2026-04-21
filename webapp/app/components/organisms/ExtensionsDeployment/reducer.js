import { fromJS } from 'immutable';
import { actionTypes } from './constants';
import * as constants from '../../pages/App/constants';

const { REQUEST, SUCCESS, FAILURE } = constants;

const initialState = fromJS({
  buildHistory: [],
  fetchingBuildHistory: null,
  buildHistoryError: null,
});

const extensionsDeploymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_EXTENSIONS_BUILD_HISTORY_REQUEST:
      return state
        .set('fetchingBuildHistory', REQUEST)
        .set('buildHistoryError', null);
    case actionTypes.GET_EXTENSIONS_BUILD_HISTORY_SUCCESS:
      return state
        .set('fetchingBuildHistory', SUCCESS)
        .set('buildHistory', fromJS(action.data || []));
    case actionTypes.GET_EXTENSIONS_BUILD_HISTORY_FAILURE:
      return state
        .set('fetchingBuildHistory', FAILURE)
        .set('buildHistoryError', fromJS(action.error));
    default:
      return state;
  }
};

export default extensionsDeploymentReducer;
