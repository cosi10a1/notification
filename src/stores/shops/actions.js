import firebase from 'firebase';
import * as types from './action-types';
import config from '../../config';

export const fetchShops = () => {
  return (dispatch, getState) => {
    try {
      return firebase
        .database()
        .ref(`shops/`)
        .on('value', snapshot => {
          let shops = snapshot.val() ? snapshot.val() : [];
          dispatch({
            type: types.SYNC_ALL_SHOP,
            data: shops
          });
        });
    } catch (error) {
      // firebaseHelper.tracking().trackException('fetchShops', error);
    }
  };
};
export const addShop = data => {
  return dispatch => {
    try {
      return firebase
        .database()
        .ref('/shops/')
        .push(data)
        .then(() => {
          firebase
            .database()
            .ref('/shops')
            .once('value', snapshot => {
              let shops = snapshot.val() ? snapshot.val() : [];
              dispatch({
                type: types.ADD_SHOP,
                shops
              });
            });
        });
      // console.log('end add shop')
    } catch (error) {}
  };
};

export const removeShop = id => {
  return (dispatch, getState) => {
    try {
      return firebase
        .database()
        .ref('/shops/')
        .child(id)
        .remove()
        .then(() => {
          firebase
            .database()
            .ref('/users')
            .on('value', snapshot => {
              var i = 0;
              var key = Object.keys(snapshot.val());
              snapshot.forEach(function(childSnapshot) {
                var user = childSnapshot.val();
                var shop = user.shops;
                if (typeof shop != 'undefined' && shop.includes(id) == 1) {
                  var index = shop.indexOf(id);
                  if (index > -1) {
                    shop.splice(index, 1);
                    firebase
                      .database()
                      .ref('/users/' + key[i] + '/shops')
                      .set(shop);
                  }
                }
                i++;
              });
            });
        })
        .then(() => {
          firebase
            .database()
            .ref('/shops')
            .on('value', snapshot => {
              let shops = snapshot.val() ? snapshot.val() : [];
              dispatch({
                type: types.DELETE_SHOP,
                shops
              });
            });
        });
    } catch (error) {}
  };
};

export const updateShop = (id, profile) => {
  return (dispatch, getState) => {
    try {
      return firebase
        .database()
        .ref('/shops/' + id + '/profile')
        .update(profile)
        .then(() => {
          firebase
            .database()
            .ref('/shops')
            .once('value')
            .then(snapshot => {
              let shops = snapshot.val() ? snapshot.val() : [];
              dispatch({
                type: types.UPDATE_SHOP,
                shops
              });
            });
        });
    } catch (error) {
      console.log(error);
    }
  };
};

export const addEmployeetoShop = (shop_id, selectedOptions) => {
  return (dispatch, getState) => {
    let roles = getState().permissions.roles;

    selectedOptions.forEach(element => {
      try {
        firebase
          .database()
          .ref('/users/' + element.id + '/permissions/')
          .transaction(current => {
            if (current != null) {
              Object.keys(current).map(per => {
                if (current[per].includes(shop_id)) {
                  let index = current[per].indexOf(shop_id);
                  current[per].splice(index, 1);
                }
              });
            }
            return current;
          })
          .then(() => {
            firebase
              .database()
              .ref('/shops/' + shop_id + '/users/')
              .child(element.id)
              .set(element.position)
              .then(() => {
                firebase
                  .database()
                  .ref('/users/' + element.id + '/shops')
                  .once('value')
                  .then(snapshot => {
                    let shops = snapshot.val() ? snapshot.val() : [];
                    if (shops.filter(c => c == shop_id).length == 0) {
                      shops.push(shop_id);
                      firebase
                        .database()
                        .ref('/users/' + element.id + '/shops')
                        .set(shops);
                    }
                  });
                if (
                  roles[element.position] &&
                  roles[element.position].permissions
                ) {
                  addPermission(
                    element.id,
                    shop_id,
                    roles[element.position].permissions
                  );
                }
              });
          });
      } catch (error) {
        console.log(error);
      }
    });
    return {};
  };
};

export const removeEmployeefromShop = (shop_id, selectedOptions) => {
  return (dispatch, getState) => {
    selectedOptions.forEach(element => {
      try {
        firebase
          .database()
          .ref('/shops/' + shop_id + '/users/')
          .child(element.id)
          .remove()
          .then(() => {
            firebase
              .database()
              .ref('/users/' + element.id + '/shops')
              .once('value')
              .then(snapshot => {
                let shops = snapshot.val() ? snapshot.val() : [];
                let new_shop = shops.filter(c => c != shop_id);
                firebase
                  .database()
                  .ref('/users/' + element.id + '/shops')
                  .set(new_shop);
              });

            removePermission(element.id, shop_id);
          });
      } catch (error) {
        console.log(error);
      }
    });
    return {};
  };
};

export const setCurrentShop = shop => {
  return (dispatch, getState) => {
    dispatch({
      type: types.SET_CURRENT_SHOP,
      shop: shop
    });
  };
};

const addPermission = (user_id, shop_id, permissions) => {
  permissions.forEach(element => {
    firebase
      .database()
      .ref('/users/' + user_id + '/permissions/' + element)
      .once('value')
      .then(snapshot => {
        let permission = snapshot.val() ? snapshot.val() : [];
        if (permission.filter(c => c == shop_id).length == 0) {
          permission.push(shop_id);
          firebase
            .database()
            .ref('/users/' + user_id + '/permissions/' + element)
            .set(permission);
        }
      });
  });
};

const removePermission = (user_id, shop_id) => {
  firebase
    .database()
    .ref('/users/' + user_id + '/permissions/')
    .once('value')
    .then(snapshot => {
      let permissions = snapshot.val() ? snapshot.val() : {};

      for (let [key, value] of Object.entries(permissions)) {
        permissions[key] = permissions[key].filter(el => el != shop_id);
      }
      firebase
        .database()
        .ref('/users/' + user_id + '/permissions/')
        .set(permissions);
    });
};

export const savePermission = (
  user_id,
  permissionData = [],
  onSuccess = () => {},
  onError = () => {}
) => {
  return (dispatch, getState) => {
    let permissionStates = getState().permissions.permissions;

    try {
      Object.keys(permissionStates).map(per => {
        firebase
          .database()
          .ref('/users/' + user_id + '/permissions/' + per)
          .transaction(current => {
            permissionData.forEach(data => {
              let check = data[per];

              if (check && current) {
                if (!current.includes(data.id)) {
                  current.push(data.id);
                }
              } else if (!check && current) {
                if (current.includes(data.id)) {
                  let index = current.indexOf(data.id);
                  current.splice(index, 1);
                }
              } else if (check && !current) {
                current = [data.id];
              }
            });
            return current;
          });
      });

      onSuccess();
    } catch (error) {
      onError();
      console.log(error);
    }
  };
};
