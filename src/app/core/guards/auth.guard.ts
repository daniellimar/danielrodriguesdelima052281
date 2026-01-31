import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {AuthFacade} from '../facades/auth.facade';

export const authGuard = () => {
  const authFacade = inject(AuthFacade);
  const router = inject(Router);

  if (authFacade.isAuthenticated) {
    return true;
  }

  return router.createUrlTree(['/auth/login']);
};
