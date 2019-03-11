import firebase from 'firebase';
import * as types from './action-types';
import config from '../../config';

export const fetchPromotions = () => {
  return (dispatch, getState) => {
    try {
      return firebase
        .database()
        .ref(`promotions/${config.env}`)
        .on('value', snapshot => {
          let promotions = [];
          snapshot.forEach(function(childSnapshot) {
            var item = childSnapshot.val();
            item.key = childSnapshot.key;
            item['key'] = childSnapshot.key;

            // if (Date.now() < item.date.endDate) {
            //   promotions.push(item);
            // }
            promotions.push(item);
          });
          dispatch({
            type: types.SYNC_FIREBASE_PROMOTIONS_DONE,
            promotions
          });
        });
    } catch (error) {
      // firebaseHelper.tracking().trackException('fetchPromotions', error);
    }
  };
};
