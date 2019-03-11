import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import Base64 from 'base-64';
import cookie from 'react-cookies';
import config from '../config';

// const API_ROOT = `https://${config.hosts.offlinesales}/pvsales/detail_reports`;
const API_ROOT = `https://${config.hosts.offlinesales}/api/v2.1`;

const REDASH_API_ROOT = `https://bi.teko.vn/api`;

const superagent = superagentPromise(_superagent, global.Promise);

const encode = encodeURIComponent;
const responseBody = res => res.body;

let token = null;
let redash_token = 'j0LDWzzQI6NvT0llIid8GN4LKwx8fLc6WeGvka7e';
const tokenPlugin = req => {
  // if (token) {
  req.set('Authorization', genAuthorization());

  // }
};

const redashTokenPlugin = req => {
  // if (token) {
  req.set('Authorization', `Key ${redash_token}`);

  // }
};

const genAuthorization = () => {
  let accessToken = cookie.load('_uat');
  return 'Basic ' + Base64.encode(accessToken + ':' + '');
};

const genRedashAuthorization = () => {
  return;
  return 'Basic ' + Base64.encode(accessToken + ':' + '');
};
// var headers={
//   "Authorization":genAuthorization()
// }
//  Logger.log(payload)
var options = {
  method: 'get',
  contentType: 'application/json'
};

const reports = {
  get: (created_from, created_to, stores, query_by) =>
    requests.get(
      `/bipvreports/?created_from=${created_from}&created_to=${created_to}&stores=${stores}&query_by=${query_by}`,
      options
    ),
  get_order: (created_from, created_to, stores) =>
    requests.get(
      `/bipvreports/?ordering=date_created&created_from=${created_from}&created_to=${created_to}&stores=${stores}`,
      options
    ),
  get_total_order: (created_from, created_to, stores) =>
    requests.get(
      `/bipvreports/by-store/?created_from=${created_from}&created_to=${created_to}&stores=${stores}`,
      options
    )
};

const requests = {
  del: url =>
    superagent
      .del(`${API_ROOT}${url}`)
      .use(tokenPlugin)
      .set('Content-Type', 'multipart/form-data')
      .then(responseBody),
  get: url =>
    superagent
      .get(`${API_ROOT}${url}`)
      .use(tokenPlugin)
      .set('Content-Type', 'multipart/form-data')
      .then(responseBody),
  put: (url, body) =>
    superagent
      .put(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .set('Content-Type', 'multipart/form-data')
      .then(responseBody),
  post: (url, body) =>
    superagent
      .post(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .set('Content-Type', 'multipart/form-data')
      .then(responseBody)
};

const redash_requests = {
  del: url =>
    superagent
      .del(`${REDASH_API_ROOT}${url}`)
      .use(redashTokenPlugin)
      .then(responseBody),
  get: url =>
    superagent
      .get(`${REDASH_API_ROOT}${url}`)
      .use(redashTokenPlugin)
      .then(responseBody),
  put: (url, body) =>
    superagent
      .put(`${REDASH_API_ROOT}${url}`, body)
      .use(redashTokenPlugin)
      .then(responseBody),
  post: (url, params) =>
    superagent
      .post(`${REDASH_API_ROOT}${url}`)
      .query(params)
      .use(redashTokenPlugin)
      .then(responseBody)
};

export default {
  reports,
  redash_token,
  redash_requests,
  setToken: _token => {
    token = _token;
  },
  setRedashToken: _token => {
    redash_token = _token;
  }
};
