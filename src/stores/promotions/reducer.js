import * as types from './action-types';

export default function reduce(state = [], action = {}) {
  switch (action.type) {
    case types.SYNC_FIREBASE_PROMOTIONS_DONE:
      return action.promotions;
    default:
      return state;
  }
}
