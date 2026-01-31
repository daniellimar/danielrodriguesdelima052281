import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthFacade} from '../facades/auth.facade';
import {catchError, switchMap, throwError} from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authFacade = inject(AuthFacade);
  const token = authFacade.currentAccessToken;

  // Não adiciona token em rotas de autenticação
  if (req.url.includes('/autenticacao/login') || req.url.includes('/autenticacao/refresh')) {
    return next(req);
  }

  // Clone request com Authorization header se token existir
  const authReq = token
    ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      // Se receber 401 e tiver refresh token, tenta renovar
      if (error.status === 401 && authFacade.currentRefreshToken) {
        return authFacade.refreshToken().pipe(
          switchMap(() => {
            // Retry da requisição original com novo token
            const newToken = authFacade.currentAccessToken;
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`
              }
            });
            return next(retryReq);
          }),
          catchError((refreshError) => {
            // Se refresh falhar, faz logout
            authFacade.logout();
            return throwError(() => refreshError);
          })
        );
      }

      // Para outros erros, apenas repassa
      return throwError(() => error);
    })
  );
};
