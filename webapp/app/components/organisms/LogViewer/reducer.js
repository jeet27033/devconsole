import { fromJS } from 'immutable';
import { actionTypes } from './constants';
import * as constants from '../../pages/App/constants';

const { REQUEST, SUCCESS, FAILURE } = constants;

const initialState = fromJS({
  logs: [],
  totalEntries: 0,
  lastTimestamp: null,
  fetching: null,
  error: null,

  extensionsMap: {},
  fetchingExtensions: null,
  extensionsError: null,
});

const logViewerReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_LOKI_LOGS_REQUEST:
      return state.set('fetching', REQUEST).set('error', null);
    case actionTypes.FETCH_LOKI_LOGS_SUCCESS:
      return state
        .set('fetching', SUCCESS)
        .set('logs', fromJS(action.data?.logs || []))
        .set('totalEntries', action.data?.totalEntries || 0)
        .set('lastTimestamp', action.data?.lastTimestamp || null);
    case actionTypes.FETCH_LOKI_LOGS_FAILURE:
      return state.set('fetching', FAILURE).set('error', fromJS(action.error));
    case actionTypes.CLEAR_LOKI_LOGS:
      return state
        .set('logs', fromJS([]))
        .set('totalEntries', 0)
        .set('lastTimestamp', null)
        .set('fetching', null)
        .set('error', null);

    case actionTypes.GET_EXTENSIONS_LIST_REQUEST:
      return state
        .set('fetchingExtensions', REQUEST)
        .set('extensionsError', null);
    case actionTypes.GET_EXTENSIONS_LIST_SUCCESS:
      return state
        .set('fetchingExtensions', SUCCESS)
        .set('extensionsMap', fromJS(action.data || {}));
    case actionTypes.GET_EXTENSIONS_LIST_FAILURE:
      return state
        .set('fetchingExtensions', FAILURE)
        .set('extensionsError', fromJS(action.error));

    default:
      return state;
  }
};

export default logViewerReducer;
