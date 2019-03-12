import { combineReducers } from 'redux';
import user from './user/reducer';
import providers from './providers/reducer';
import shops from './shops/reducer';
import employees from './employees/reducer';
import promotions from './promotions/reducer';
import { reducer as formReducer } from 'redux-form';
import reports from './reports/reducer';
import order from './carts/reducer';
import permissions from './permissions/reducer';

// Combines all reducers to a single reducer function
const reducer = combineReducers({
  user,
  providers,
  shops,
  employees,
  promotions,
  form: formReducer,
  reports,
  order,
  permissions
});

export default reducer;