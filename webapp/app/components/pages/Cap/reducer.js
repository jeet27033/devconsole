import { fromJS } from 'immutable';
import { actionTypes } from './constants';
import * as constants from '../App/constants';

const { REQUEST, SUCCESS, FAILURE, INITIAL } = constants;

const initialState = fromJS({
  currentOrgDetails: {},
  user: {},
  sidebarMenuData: [],
  topbarMenuData: [],
  fetchingUserdata: false,
  fetchingSupportedLocales: INITIAL,
  supportedLocales: [],
});

const capReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_SIDEBAR_MENU_DATA_REQUEST:
      return state.set('sidebarMenuData', fromJS({ status: REQUEST }));
    case actionTypes.GET_SIDEBAR_MENU_DATA_SUCCESS:
      return state.set(
        'sidebarMenuData',
        fromJS({ status: SUCCESS, data: action.data }),
      );
    case actionTypes.GET_SIDEBAR_MENU_DATA_FAILURE:
      return state.set(
        'sidebarMenuData',
        fromJS({ status: FAILURE, error: action.error }),
      );
    case actionTypes.CLEAR_SIDEBAR_MENU_DATA:
      return state.set('sidebarMenuData', fromJS({}));
    case actionTypes.GET_TOPBAR_MENU_DATA_REQUEST:
      return state.set('topbarMenuData', fromJS({ status: REQUEST }));
    case actionTypes.GET_TOPBAR_MENU_DATA_SUCCESS:
      return state.set(
        'topbarMenuData',
        fromJS({ status: SUCCESS, data: action.data }),
      );
    case actionTypes.GET_TOPBAR_MENU_DATA_FAILURE:
      return state.set(
        'topbarMenuData',
        fromJS({ status: FAILURE, error: action.error }),
      );
    case actionTypes.CLEAR_TOPBAR_MENU_DATA:
      return state.set('topbarMenuData', fromJS({}));
    case actionTypes.SWITCH_ORG_REQUEST:
      return state.set('changeOrg', REQUEST);
    case actionTypes.SWITCH_ORG_SUCCESS:
      return state.set('orgID', action.orgID).set('changeOrg', SUCCESS);
    case actionTypes.SWITCH_ORG_FAILURE:
      return state.set(
        'changeOrg',
        fromJS({ status: FAILURE, error: action.error }),
      );
    case actionTypes.GET_USER_DATA_REQUEST:
      return state.set('fetchingUserdata', REQUEST);
    case actionTypes.GET_USER_DATA_SUCCESS:
      return state
        .set('fetchingUserdata', SUCCESS)
        .set('user', fromJS(action.userData))
        .set('currentOrgDetails', fromJS(action.currentOrgDetails))
        .set('orgID', action.currentOrgId);
    case actionTypes.GET_USER_DATA_FAILURE:
      return state.set('fetchingUserdata', FAILURE);
    case actionTypes.GET_SUPPORTED_LOCALES_REQUEST:
      return state.set('fetchingSupportedLocales', REQUEST);
    case actionTypes.GET_SUPPORTED_LOCALES_SUCCESS:
      return state
        .set('fetchingSupportedLocales', SUCCESS)
        .set('supportedLocales', fromJS(action.data));
    case actionTypes.GET_SUPPORTED_LOCALES_FAILURE:
      return state
        .set('fetchingSupportedLocales', FAILURE)
        .set('supportedLocales', fromJS([]));
    default:
      return state;
  }
};

export default capReducer;
