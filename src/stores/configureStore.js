import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import reducer from './reducer';
import config from '../config';
import { routerMiddleware } from 'react-router-redux';
import createSageMiddleware from 'redux-saga';
import { formMiddleware, adminSaga, USER_LOGOUT } from 'react-admin';
import { all, fork } from 'redux-saga/effects';

//  Returns the store instance
// It can  also take initialState argument when provided
const configureStore = (
  authProvider,
  dataProvider,
  i18bnProvider = defaultI18nProvider,
  history,
  local = 'en'
) => {
  // const resettableAppReducer = (state, action) =>
  //       reducer(action.type !== USER_LOGOUT ? state : undefined, action);
  // const saga= function* rootSaga(){
  //   yield all(
  //     [
  //       adminSaga(dataProvider, authProvider, i18bnProvider)
  //     ].map(fork)
  //   )
  // }
  // let sagaMiddleware = createSageMiddleware()

  if (config.logEnabled) {
    const store = createStore(
      reducer,
      applyMiddleware(thunk, logger, routerMiddleware(history))
    );
    // sagaMiddleware.run(saga)
    return store;
    // return {
    //   ...createStore(resettableAppReducer, applyMiddleware(sagaMiddleware,thunk, logger,routerMiddleware(history)))
    // };
  } else {
    const store = createStore(
      reducer,
      applyMiddleware(thunk, routerMiddleware(history))
    );
    // sagaMiddleware.run(saga)
    return store;

    // return {
    //   ...createStore(resettableAppReducer, applyMiddleware(thunk,routerMiddleware(history),formMiddleware))
    // };
  }
};

// const store = configureStore();

export default configureStore;
