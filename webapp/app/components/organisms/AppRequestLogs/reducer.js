import { fromJS } from 'immutable';
import { actionTypes } from './constants';
import * as constants from '../../pages/App/constants';

const { REQUEST, SUCCESS, FAILURE } = constants;

const initialState = fromJS({
  extensionsMap: {},
  fetchingExtensions: null,
  extensionsError: null,
  appConfig: null,
  fetchingAppFields: null,
  appFieldsError: null,
});

const appRequestLogsReducer = (state = initialState, action) => {
  switch (action.type) {
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
    case actionTypes.GET_APP_FIELDS_REQUEST:
      return state
        .set('fetchingAppFields', REQUEST)
        .set('appConfig', null)
        .set('appFieldsError', null);
    case actionTypes.GET_APP_FIELDS_SUCCESS:
      return state
        .set('fetchingAppFields', SUCCESS)
        .set('appConfig', fromJS(action.data || {}));
    case actionTypes.GET_APP_FIELDS_FAILURE:
      return state
        .set('fetchingAppFields', FAILURE)
        .set('appFieldsError', fromJS(action.error));
    default:
      return state;
  }
};

export default appRequestLogsReducer;
