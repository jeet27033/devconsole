import { fromJS } from 'immutable';
import { actionTypes } from './constants';
import * as constants from '../../pages/App/constants';

const { REQUEST, SUCCESS, FAILURE } = constants;

const initialState = fromJS({
  configs: [],
  fetchingConfigs: null,
  configsError: null,

  configRequests: [],
  fetchingConfigRequests: null,
  configRequestsError: null,

  savingConfig: null,
  saveConfigError: null,
});

const configManagementReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_CONFIGS_REQUEST:
      return state.set('fetchingConfigs', REQUEST).set('configsError', null);
    case actionTypes.GET_CONFIGS_SUCCESS:
      return state
        .set('fetchingConfigs', SUCCESS)
        .set('configs', fromJS(action.data || []));
    case actionTypes.GET_CONFIGS_FAILURE:
      return state
        .set('fetchingConfigs', FAILURE)
        .set('configsError', fromJS(action.error));

    case actionTypes.GET_CONFIG_REQUESTS_REQUEST:
      return state
        .set('fetchingConfigRequests', REQUEST)
        .set('configRequestsError', null);
    case actionTypes.GET_CONFIG_REQUESTS_SUCCESS:
      return state
        .set('fetchingConfigRequests', SUCCESS)
        .set('configRequests', fromJS(action.data || []));
    case actionTypes.GET_CONFIG_REQUESTS_FAILURE:
      return state
        .set('fetchingConfigRequests', FAILURE)
        .set('configRequestsError', fromJS(action.error));

    case actionTypes.SAVE_CONFIG_REQUEST:
      return state.set('savingConfig', REQUEST).set('saveConfigError', null);
    case actionTypes.SAVE_CONFIG_SUCCESS:
      return state.set('savingConfig', SUCCESS);
    case actionTypes.SAVE_CONFIG_FAILURE:
      return state
        .set('savingConfig', FAILURE)
        .set('saveConfigError', fromJS(action.error));
    case actionTypes.RESET_SAVE_CONFIG:
      return state.set('savingConfig', null).set('saveConfigError', null);

    default:
      return state;
  }
};

export default configManagementReducer;
