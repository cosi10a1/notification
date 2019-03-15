import { combineReducers } from 'redux';
import user from './user/reducer';
import shops from './shops/reducer';
import employees from './employees/reducer';
import promotions from './promotions/reducer';
import reports from './reports/reducer';
import permissions from './permissions/reducer';
import admin from 'ra-core/esm/reducer/admin';
import i18n from 'ra-core/esm/reducer/i18n';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';

// Combines all reducers to a single reducer function
const reducer = combineReducers({
  user,
  shops,
  employees,
  promotions,
  form: formReducer,
  reports,
  permissions,
  routerReducer,
  i18n,
  admin
});

export default reducer;
