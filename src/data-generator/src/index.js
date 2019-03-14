import generateNotifications from './notifications';
import finalize from './finalize';

export default (options = { serializeDate: true }) => {
  const db = {};
  db.notifications = generateNotifications(db, options);
  finalize(db);

  return db;
};
