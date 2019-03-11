import * as types from './action-types';
import _ from 'lodash';

const initialState = {
  profile: {},
  providers: [],
  shops: []
};

export default (state = {}, action = {}) => {
  switch (action.type) {
    case types.SYNC_EMPLOYEE:
      return { ...state, [action.id]: action.data };
    case types.REMOVE_EMPLOYEE:
      return _.omit(state, action.id);
    case types.SYNC_EMPLOYEES:
      return action.employees;
    case types.UPDATE_EMPLOYEE:
      return action.employees;
    default:
      return state;
  }
};
