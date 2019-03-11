import * as types from './action-types';

const initialState = {
  carts: [],
  provinces: [],
  districts: [],
  communes: []
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.SYNC_FIREBASE_CARTS_DONE:
      return { ...state, carts: action.carts };
    case types.SYNC_PROVINCES:
      return { ...state, provinces: action.provinces };
    case types.SYNC_DISTRICTS:
      return { ...state, districts: action.districts };
    case types.SYNC_COMMUNES:
      return { ...state, communes: action.communes };
    default:
      return state;
  }
}
