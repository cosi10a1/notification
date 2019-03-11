import firebase from 'firebase';
import employees from './reducer';
import * as types from './action-types';
import store from '../../stores/configureStore';

export const fetchProvince = () => {
  return dispatch => {
    try {
      return firebase
        .database()
        .ref(`province/`)
        .on('value', snapshot => {
          let provinces = snapshot.val() ? snapshot.val() : [];
          dispatch({
            type: types.SYNC_PROVINCES,
            provinces
          });
        });
    } catch (error) {
      // firebaseHelper.tracking().trackException('fetchShops', error);
    }
  };
};

export const fetchDistrict = () => {
  return dispatch => {
    try {
      return firebase
        .database()
        .ref(`district/`)
        .on('value', snapshot => {
          let districts = snapshot.val() ? snapshot.val() : [];
          dispatch({
            type: types.SYNC_DISTRICTS,
            districts
          });
        });
    } catch (error) {
      // firebaseHelper.tracking().trackException('fetchShops', error);
    }
  };
};

export const fetchCommune = () => {
  return dispatch => {
    try {
      return firebase
        .database()
        .ref(`commune/`)
        .on('value', snapshot => {
          let communes = snapshot.val() ? snapshot.val() : [];
          dispatch({
            type: types.SYNC_COMMUNES,
            communes
          });
        });
    } catch (error) {
      // firebaseHelper.tracking().trackException('fetchShops', error);
    }
  };
};
