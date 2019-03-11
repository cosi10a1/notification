export const havePermission = (user, permission, shop = null) => {
  if (user && user.is_superuser) {
    return true;
  } else if (user && user.permissions && user.permissions[permission]) {
    if (shop != null) {
      if (user.permissions[permission].includes(shop)) {
        return true;
      }
    } else {
      return true;
    }
  }
  return false;
};
