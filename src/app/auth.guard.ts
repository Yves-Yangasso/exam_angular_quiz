import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  return true;

  var type_utilisateur = 'admin';
  if (type_utilisateur == 'admin') {
    return true;
  } else {
    return false;
  }
};
