import * as types from './action-types';
import _ from 'lodash';

export default (state = {}, action = {}) => {
  switch (action.type) {
    case types.GET_ROLES_AND_PERMISSIONS:
      return { ...state, ...action.data };
    default:
      return state;
  }
};
