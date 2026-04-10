import { defineActionTypes } from '@capillarytech/vulcan-react-sdk/utils'

const scope = "/Components/pages/Login/"

export const actionTypes = defineActionTypes(
  {
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    LOGOUT_REQUEST: 'LOGOUT_REQUEST',
    LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
    LOGOUT_FAILURE: 'LOGOUT_FAILURE'
  },
  { prefix: CURRENT_APP_NAME, scope: scope },
);
