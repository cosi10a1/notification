import * as types from './action-types';

const initialState = {}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case types.SYNC_PROVIDER:
      return { ...state, [action.id]: action.data };
    default:
      return state;
  }
};
