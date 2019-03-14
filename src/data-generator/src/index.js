import generateNotifications from './notifications';
import finalize from './finalize';
import generateCategories from './categories';


export default (options = { serializeDate: true }) => {
  const db = {};
  db.notifications = generateNotifications(db, options);
  db.categories = generateCategories(db, options);
  finalize(db);

  return db;
};
