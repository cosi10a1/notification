import * as types from "./action-types";
import _ from "lodash";

export default (state = { check: false }, action = {}) => {
  switch (action.type) {
    case types.FORCE_RELOGIN:
      return { ...state, check: true };
    case types.SET_AUTHENTICATED_USER:
      return { ...state, check: true, uid: action.user.uid };
    case types.USER_SIGNED_OUT:
      return {check: false}
    case types.SYNC_USER_INFORMATION:
      return { ...state, ...action.info };
    default:
      return state;
  }
};
