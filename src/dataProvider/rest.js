import simpleRestProvider from 'ra-data-simple-rest';

import {fetchUtils} from 'react-admin'

import config from '../config'
import { GET_LIST,CREATE } from 'ra-core';

const buildToken =(tokenType, token)=>{
  return tokenType + ' ' + token
}

const buildClient =(tokenType)=>(url, options={})=>{
    options.user = {
      authenticated:true,
      token: buildToken(tokenType, "296fd5b6941a460fa741248c4b471bad")
    }
    options.headers = new Headers({ Accept: 'application/json' });
    options.headers.set('Access-Control-Expose-Headers', 'Content-Range');
    return fetchUtils.fetchJson(url,options)
  }

const notificationProvider = simpleRestProvider('http://'+config.hosts.stn, buildClient('Basic'));
const restProvider = simpleRestProvider('http://localhost:4000');

export default (type, resource, params) =>
  new Promise(resolve => {
    switch(resource){
      case 'notifications':
        switch(type){
          case CREATE:
            console.log('params',params)
            resolve(notificationProvider(CREATE,'api/notification/multicast',{
                x:"y",
                y:"z"
            }))
          default:
            setTimeout(() => resolve(restProvider(type, resource, params)), 500)
        }
      default:
        setTimeout(() => resolve(restProvider(type, resource, params)), 500)
    }
  });
