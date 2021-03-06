import firebase from 'firebase';
import * as user_types from './user/action-types';
import * as shop_types from './shops/action-types';
import * as cart_types from './carts/action-types';
import * as permissions_types from './permissions/action-types';
export const syncFirebaseData = uid => {
  return (dispatch, getState) => {
    firebase
      .database()
      .ref('users/' + uid)
      .on('value', snapshot => {
        let info = snapshot.val() ? snapshot.val() : {};
        dispatch({
          type: user_types.SYNC_USER_INFORMATION,
          info
        });

        dispatch(syncPermissionsFromFirebase());

        if (info.is_superuser) {
          syncAllShopsfromFirebase(dispatch);
        } else {
          syncShopsFromFirebase(dispatch, getState().shops, info.shops);
        }
      });
  };
};

const syncAllShopsfromFirebase = dispatch => {
  firebase
    .database()
    .ref('shops/')
    .on('value', snapshot => {
      let data = snapshot.val() ? snapshot.val() : {};
      let shops = [];

      Object.entries(data).map(function([key, value]) {
        if (value.profile) {
          let shop = { shop_id: key, ...value };
          shops.push(shop);
        }
      });

      dispatch({
        type: shop_types.GET_ALL_SHOPS,
        data: shops
      });
    });
};

const syncShopsFromFirebase = (dispatch, state_shops, shops) => {
  if (shops && shops.length > 0) {
    shops.forEach(shop => {
      if (!state_shops[shop]) {
        firebase
          .database()
          .ref('shops/' + shop)
          .on('value', snapshot => {
            let data = snapshot.val() ? snapshot.val() : {};
            dispatch({
              type: shop_types.SYNC_SHOP,
              shop_id: shop,
              data
            });
          });
      }
    });
  }
};

export const syncCartsFromFirebase = () => {
  return (dispatch, getState) => {
    let currentShop = getState().user.profile.default_shop;
    let user_shop_index = getState().shops.shopsList.findIndex(
      x => x.shop_id === currentShop
    );
    if (user_shop_index !== -1) {
      let shop = getState().shops.shopsList[user_shop_index].profile.store_id;
      firebase
        .database()
        .ref('carts/' + shop)
        .on('value', snapshot => {
          dispatch({
            type: cart_types.SYNC_FIREBASE_CARTS_DONE,
            carts: snapshot.val() ? snapshot.val() : []
          });
        });
    }
  };
};

const syncPermissionsFromFirebase = () => {
  return (dispatch, getState) => {
    firebase
      .database()
      .ref('roles-permissions/')
      .on('value', snapshot => {
        dispatch({
          type: permissions_types.GET_ROLES_AND_PERMISSIONS,
          data: snapshot.val() ? snapshot.val() : []
        });
      });
  };
};
