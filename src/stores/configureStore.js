import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import reducer from './reducer';
import config from '../config';

//  Returns the store instance
// It can  also take initialState argument when provided
const configureStore = () => {
  if (config.logEnabled) {
    return {
      ...createStore(reducer, applyMiddleware(thunk, logger))
    };
  } else {
    return {
      ...createStore(reducer, applyMiddleware(thunk))
    };
  }
};

const store = configureStore();

export default store;
