import { fromJS } from 'immutable';
import { actionTypes } from './constants';
import * as constants from '../../pages/App/constants';

const { REQUEST, SUCCESS, FAILURE } = constants;

const initialState = fromJS({
  buildHistory: [],
  fetchingBuildHistory: null,
  buildHistoryError: null,

  buildLogs: '',
  fetchingBuildLogs: null,
  buildLogsError: null,

  buildMeta: [],
  fetchingBuildMeta: null,
  buildMetaError: null,

  triggerBuildResult: null,
  triggeringBuild: null,
  triggerBuildError: null,
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

    case actionTypes.GET_EXTENSIONS_BUILD_LOGS_REQUEST:
      return state
        .set('fetchingBuildLogs', REQUEST)
        .set('buildLogsError', null)
        .set('buildLogs', '');
    case actionTypes.GET_EXTENSIONS_BUILD_LOGS_SUCCESS:
      return state
        .set('fetchingBuildLogs', SUCCESS)
        .set('buildLogs', action.data || '');
    case actionTypes.GET_EXTENSIONS_BUILD_LOGS_FAILURE:
      return state
        .set('fetchingBuildLogs', FAILURE)
        .set('buildLogsError', fromJS(action.error));
    case actionTypes.CLEAR_EXTENSIONS_BUILD_LOGS:
      return state
        .set('fetchingBuildLogs', null)
        .set('buildLogs', '')
        .set('buildLogsError', null);

    case actionTypes.GET_EXTENSIONS_BUILD_META_REQUEST:
      return state
        .set('fetchingBuildMeta', REQUEST)
        .set('buildMetaError', null);
    case actionTypes.GET_EXTENSIONS_BUILD_META_SUCCESS:
      return state
        .set('fetchingBuildMeta', SUCCESS)
        .set('buildMeta', fromJS(action.data || []));
    case actionTypes.GET_EXTENSIONS_BUILD_META_FAILURE:
      return state
        .set('fetchingBuildMeta', FAILURE)
        .set('buildMetaError', fromJS(action.error));

    case actionTypes.TRIGGER_EXTENSIONS_BUILD_REQUEST:
      return state
        .set('triggeringBuild', REQUEST)
        .set('triggerBuildError', null)
        .set('triggerBuildResult', null);
    case actionTypes.TRIGGER_EXTENSIONS_BUILD_SUCCESS:
      return state
        .set('triggeringBuild', SUCCESS)
        .set('triggerBuildResult', fromJS(action.data || null));
    case actionTypes.TRIGGER_EXTENSIONS_BUILD_FAILURE:
      return state
        .set('triggeringBuild', FAILURE)
        .set('triggerBuildError', fromJS(action.error));
    case actionTypes.RESET_TRIGGER_EXTENSIONS_BUILD:
      return state
        .set('triggeringBuild', null)
        .set('triggerBuildResult', null)
        .set('triggerBuildError', null);

    default:
      return state;
  }
};

export default extensionsDeploymentReducer;
