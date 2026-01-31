import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthFacade} from '../facades/auth.facade';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authFacade = inject(AuthFacade);
  const token = authFacade.currentAccessToken;

  if (token && !req.url.includes('/autenticacao/login')) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  return next(req);
};
