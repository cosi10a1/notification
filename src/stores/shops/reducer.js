import * as types from './action-types';

const initialState = {
  shopsList: [],
  isLoading: true,
  all_shops: [],
  currentShop: ''
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case types.SYNC_SHOP:
      let index = state.shopsList.findIndex(x => x.shop_id === action.shop_id);
      if (index === -1)
        return {
          ...state,
          isLoading: false,
          shopsList: [
            ...state.shopsList,
            { shop_id: action.shop_id, ...action.data }
          ]
        };
      else {
        let shopsList = state.shopsList.slice();
        shopsList[index] = { shop_id: action.shop_id, ...action.data };
        return {
          ...state,
          isLoading: false,
          shopsList
        };
      }
    case types.SYNC_ALL_SHOP:
      let shops = action.data;
      let data = Object.keys(shops).map(key => {
        let shop = shops[key];
        return {
          shop_id: shop.profile.store_id,
          profile: shop.profile,
          users: shop.users
        };
      });
      return { ...state, all_shops: data };
    case types.DELETE_SHOP:
      return { ...state, shops: action.shops };
    case types.ADD_SHOP:
      return { ...state, shops: action.shops };
    case types.UPDATE_NEW_SHOP_FIELD:
      return { ...state, [action.key]: action.value };
    case types.CLEAR_NEW_SHOP_FIELD:
      return { ...initialState, shops: state.shops };
    case types.SET_CURRENT_SHOP:
      return { ...state, currentShop: action.shop };
    case types.GET_ALL_SHOPS:
      return {
        ...state,
        shopsList: [...action.data]
      };
    default:
      return state;
  }
};
