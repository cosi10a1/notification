import firebase from 'firebase';
import employees from './reducer';
import * as types from './action-types';
import store from '../../stores/configureStore';

export const fetchUser = provider => {
  return (dispatch, getState) => {
    let employees = getState().providers[provider].users
      ? Object.keys(getState().providers[provider].users)
      : [];

    employees = employees.filter(
      e => Object.keys(getState().employees).indexOf(e) === -1
    );

    let unemployed = Object.keys(getState().employees).filter(
      e => employees.indexOf(e) === -1
    );
    unemployed.forEach(employee => {
      firebase.database().ref('users/' + employee).off;
      dispatch({
        type: types.REMOVE_EMPLOYEE,
        id: employee
      });
    });

    employees.forEach(employee => {
      firebase
        .database()
        .ref('users/' + employee)
        .on('value', snapshot => {
          let data = snapshot.val() ? snapshot.val() : {};
          dispatch({
            type: types.SYNC_EMPLOYEE,
            id: employee,
            data
          });
        });
    });
  };
};

export const fetchEmployees = () => {
  return (dispatch, getState) => {
    try {
      return firebase
        .database()
        .ref(`users/`)
        .on('value', snapshot => {
          let employees = snapshot.val() ? snapshot.val() : [];
          dispatch({
            type: types.SYNC_EMPLOYEES,
            employees
          });
        });
    } catch (error) {
      // firebaseHelper.tracking().trackException('fetchShops', error);
    }
  };
};

export const updateEmployee = (
  id,
  data,
  position,
  shop_id,
  onSuccess,
  onErr
) => {
  return dispatch => {
    firebase
      .database()
      .ref(`users/`)
      .child(id)
      .update(data)
      .then(() => {
        if (position !== undefined && shop_id !== undefined) {
          firebase
            .database()
            .ref('shops/' + shop_id + '/users/')
            .child(id)
            .set(position);
        }
        firebase
          .database()
          .ref('users/')
          .on('value', snapshot => {
            let employees = snapshot.val() ? snapshot.val() : [];
            dispatch({
              type: types.UPDATE_EMPLOYEE,
              employees
            });
          });
        onSuccess();
      })
      .catch(error => {
        onErr();
        return {
          errorCode: error.code,
          errorMessage: error.message
        };
      });
  };
};

export const updateAllPermission = (onSuccess = () => {}, onErr = () => {}) => {
  return (dispatch, getState) => {
    try {
      let shops = getState().shops.shopsList;
      let users = getState().employees;
      let permissions = getState().permissions.permissions;
      let roles = getState().permissions.roles;
      shops.map(shop => {
        Object.keys(shop.users).map(userId => {
          firebase
            .database()
            .ref('users/' + userId + '/permissions')
            .transaction(current => {
              if (current) {
                if (roles[shop.users[userId]]) {
                  roles[shop.users[userId]].permissions.map(permission => {
                    if (current[permission] != null) {
                      if (!current[permission].includes(shop.shop_id))
                        current[permission].push(shop.shop_id);
                    } else {
                      current[permission] = [shop.shop_id];
                    }
                  });
                }
              } else {
                if (roles[shop.users[userId]]) {
                  roles[shop.users[userId]].permissions.map(permission => {
                    if (!current) {
                      current = { [permission]: [shop.shop_id] };
                    } else {
                      current[permission] = [shop.shop_id];
                    }
                  });
                }
              }
              return current;
            })
            .catch(err => {
              onErr();
              console.log(err);
            });
        });
      });
      onSuccess();
    } catch (error) {
      onErr();

      console.log(error);
    }
  };
};
