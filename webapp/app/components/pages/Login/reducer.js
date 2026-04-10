import { fromJS } from 'immutable';
import { actionTypes } from './constants';
import * as constants from '../App/constants';

const { REQUEST, SUCCESS, FAILURE } = constants;

const loginReducer = (state = fromJS({}), action) => {
  switch (action.type) {
    case actionTypes.LOGIN_SUCCESS:
      return state
        .set('loginStatus', SUCCESS)
        .set('loginError', null)
        .set('user', fromJS(action.res.user))
        .set('orgID', action.res.user.orgID);
        // .set('token', action.res.token); Need not have token in reducer. Commented this part
    case actionTypes.LOGIN_FAILURE:
      return state.set('loginStatus', FAILURE).set(
        'loginError',
        fromJS({
          message: action.error.message,
          errorCode: action.error.response.status,
        }),
      );
    case actionTypes.LOGOUT_REQUEST:
      return state.set('logoutStatus', REQUEST);
    case actionTypes.LOGOUT_SUCCESS:
      return state.set('logoutStatus', SUCCESS);
    case actionTypes.LOGOUT_FAILURE:
      return state
        .set('logoutStatus', FAILURE)
        .set('logoutError', fromJS(action.error));
    default:
      return state;
  }
};

export default loginReducer;
