import * as types from './action-types';
// Services
import firebase from 'firebase';
import cookie from 'react-cookies';

export const setAuthenticatedUser = user => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: types.SET_AUTHENTICATED_USER,
        user
      });
      resolve();
    });
  };
};

export const signOut = () => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: types.USER_SIGNED_OUT
      });
      resolve();
    });
  };
};
