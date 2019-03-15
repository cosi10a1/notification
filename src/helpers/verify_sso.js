import cookie from 'react-cookies';
import config from '../config';
import * as firebase from 'firebase';
import { setAuthenticatedUser } from '../stores/user/actions';
import { syncFirebaseData } from '../stores/actions';
import * as types from '../stores/user/action-types';
import { userLogin as userLoginAction,USER_CHECK_SUCCESS } from 'react-admin';

export const verify_sso = (idToken, user) => {
  if (idToken) {
    let verify_idToken_url = `https://${
      config.hosts.sso
    }/api/verify_gg_id_token?idToken=${idToken}`;
    return (dispatch, getState) => {
      return fetch(verify_idToken_url).then(response => {
        if (response.ok) {
          response.json().then(result => {
            if (result.accessToken) {
              cookie.save('_uat', result['accessToken'], { path: '/' });
              localStorage.removeItem('idToken');

              dispatch(setAuthenticatedUser(user)).then(() => {
                console.log("Save uat:",result['accessToken'])
                dispatch({
                  type: USER_CHECK_SUCCESS,
                  nill
                });
                dispatch(syncFirebaseData(user.uid));
              });
            }
          });
        } else {
          firebase.auth().signOut();
          dispatch({ type: types.FORCE_RELOGIN });
        }
      });
    };
  } else {
    return (dispatch, getState) => {
      dispatch({ type: types.FORCE_RELOGIN });
    };
  }
};

export const verify_accessToken = function(accessToken, user) {
  return (dispatch, getState) => {
    var validate_url = `https://${
      config.hosts.sso
    }/api/validate_access_token?accessToken=${accessToken}`;
    fetch(validate_url)
      .then(response => {
        if (response.status == 200) {
          return dispatch(setAuthenticatedUser(user));
        } else {
          firebase.auth().signOut();
          dispatch({ type: types.FORCE_RELOGIN });
        }
      })
      .then(() => {
        dispatch(syncFirebaseData(user.uid));
      });
  };
};
