import simpleRestProvider from 'ra-data-simple-rest';

const restProvider = simpleRestProvider('http://localhost:4000');
export default (type, resource, params) =>
  new Promise(resolve => {
    console.log(type, resource, params);
    setTimeout(() => resolve(restProvider(type, resource, params)), 500);
  });
