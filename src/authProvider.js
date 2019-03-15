import {
  AUTH_GET_PERMISSIONS,
  AUTH_LOGIN,
  AUTH_LOGOUT,
  AUTH_ERROR,
  AUTH_CHECK
} from 'react-admin'; // eslint-disable-line import/no-unresolved
import cookie from 'react-cookies';
import { concatSeries } from 'async';

// Authenticatd by default
export default (type, params) => {
  console.log("auth provider:",type,params)
  if (type === AUTH_LOGIN) {
    return Promise.resolve();
  }
  if (type === AUTH_LOGOUT) {
    console.log("AUTH_LOGOUT:",type,params)
    localStorage.removeItem('jwt');
    cookie.remove('_uat',{path:"/"});
    return Promise.resolve({ redirectTo: '/login' });
  }
  if (type === AUTH_ERROR) {
    const { status } = params;
    return status === 401 || status === 403
      ? Promise.reject()
      : Promise.resolve();
  }
  if (type === AUTH_CHECK) {
    return cookie.load('_uat') == '' ? Promise.reject() : Promise.resolve();
  }
  if (type === AUTH_GET_PERMISSIONS) {
    // const role = localStorage.getItem('role');
    return Promise.resolve();
  }

  return Promise.reject('Unknown method');
};
