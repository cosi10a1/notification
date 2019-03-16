import simpleRestProvider from 'ra-data-simple-rest';

import { fetchUtils } from 'react-admin';

import config from '../config';
import { GET_LIST, CREATE } from 'ra-core';
import cookie from 'react-cookies';
import Base64 from 'base-64';

const buildToken = (tokenType, token) => {
  return tokenType + ' ' + token;
};

const buildClient = tokenType => (url, options = {}) => {
  let token = cookie.load('_uat');
  options.user = {
    authenticated: true,
    token: buildToken(tokenType, Base64.encode(token + ':' + ''))
  };
  options.headers = new Headers({
    Accept: 'application/json',
    'content-type': 'application/x-www-form-urlencoded'
  });
  return fetchUtils.fetchJson(url, options);
};

const buildTekoUatClient = () => (url, options = {}) => {
  let token = cookie.load('_uat');
  options.user = {
    authenticated: true
  };
  options.headers = new Headers({
    Accept: 'application/json',
    'teko-uat': token
  });
  return fetchUtils.fetchJson(url, options);
};

const notificationProvider = simpleRestProvider(
  'http://' + config.hosts.offlinesales,
  buildClient('Basic')
);

const viewNotificationProvider = simpleRestProvider(
  'http://' + config.hosts.stn,
  buildTekoUatClient()
);

const offlinesalesProvider = simpleRestProvider(
  'http://' + config.hosts.offlinesales,
  buildClient('Basic')
);

const restProvider = simpleRestProvider('http://localhost:4000');

export default (type, resource, params) =>
  new Promise(resolve => {
    switch (resource) {
      case 'notifications':
        switch (type) {
          case CREATE:
            console.log('params', params);
            resolve(
              notificationProvider(CREATE, 'api/v2.1/users/notify/', {
                params
              }).then(result => {
                console.log('Create success');
              })
            );
          case GET_LIST:
            console.log('params', params);
            resolve(
              viewNotificationProvider(GET_LIST, 'api/notifications', {
                app_id: 'nhanvien',
                limit: 10
              }).then(result => {
                console.log('Get result:', result);
              })
            );
          default:
            setTimeout(
              () => resolve(restProvider(type, resource, params)),
              500
            );
        }
        break;
      case 'permission_groups':
        switch (type) {
          case GET_LIST:
            console.log('permission_groups1');
            resolve(
              offlinesalesProvider(
                GET_LIST,
                'api/v2.1/permission_groups/',
                params
              )
            );
          default:
            resolve(
              offlinesalesProvider(
                GET_LIST,
                'api/v2.1/permission_groups/',
                params
              )
            );
        }
        break;
      default:
        resolve(
          offlinesalesProvider(GET_LIST, 'api/v2.1/permission_groups/', params)
        );
    }
  });
