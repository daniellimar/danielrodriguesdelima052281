import {HttpErrorResponse, HttpRequest} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';
import {of, throwError} from 'rxjs';
import {authInterceptor} from './auth.interceptor';
import {AuthFacade} from '../facades/auth.facade';

describe('authInterceptor', () => {
  let authFacadeMock: any;
  let nextFn: any;

  beforeEach(() => {
    authFacadeMock = {
      currentAccessToken: null,
      currentRefreshToken: null,
      refreshToken: vi.fn(),
      logout: vi.fn()
    };

    nextFn = vi.fn();

    TestBed.configureTestingModule({
      providers: [{provide: AuthFacade, useValue: authFacadeMock}]
    });
  });

  function runInterceptor(req: HttpRequest<any>) {
    return TestBed.runInInjectionContext(() =>
      authInterceptor(req, nextFn)
    );
  }

  it('should NOT add Authorization header for login endpoint', () => {
    const req = new HttpRequest('GET', '/autenticacao/login');

    nextFn.mockReturnValue(of('ok'));

    runInterceptor(req).subscribe();

    expect(nextFn).toHaveBeenCalledWith(req);
  });

  it('should add Authorization header when token exists', () => {
    authFacadeMock.currentAccessToken = 'access-token';

    const req = new HttpRequest('GET', '/api/test');

    nextFn.mockImplementation((request: HttpRequest<any>) => {
      expect(request.headers.get('Authorization')).toBe(
        'Bearer access-token'
      );
      return of('ok');
    });

    runInterceptor(req).subscribe();
  });

  it('should NOT add Authorization header when token does not exist', () => {
    const req = new HttpRequest('GET', '/api/test');

    nextFn.mockImplementation((request: HttpRequest<any>) => {
      expect(request.headers.has('Authorization')).toBe(false);
      return of('ok');
    });

    runInterceptor(req).subscribe();
  });

  it('should refresh token and retry request on 401 error', () => {
    authFacadeMock.currentAccessToken = 'old-token';
    authFacadeMock.currentRefreshToken = 'refresh-token';

    const req = new HttpRequest('GET', '/api/test');

    // Primeira chamada retorna 401
    nextFn
      .mockReturnValueOnce(
        throwError(() => new HttpErrorResponse({status: 401}))
      )
      // Retry após refresh
      .mockImplementationOnce((retryReq: HttpRequest<any>) => {
        expect(retryReq.headers.get('Authorization')).toBe(
          'Bearer new-token'
        );
        return of('success');
      });

    authFacadeMock.refreshToken.mockImplementation(() => {
      authFacadeMock.currentAccessToken = 'new-token';
      return of(null);
    });

    runInterceptor(req).subscribe((result) => {
      expect(result).toBe('success');
    });

    expect(authFacadeMock.refreshToken).toHaveBeenCalled();
  });

  it('should logout when refresh token fails', () => {
    authFacadeMock.currentRefreshToken = 'refresh-token';

    const req = new HttpRequest('GET', '/api/test');

    nextFn.mockReturnValue(
      throwError(() => new HttpErrorResponse({status: 401}))
    );

    authFacadeMock.refreshToken.mockReturnValue(
      throwError(() => new Error('refresh failed'))
    );

    runInterceptor(req).subscribe({
      error: () => {
        expect(authFacadeMock.logout).toHaveBeenCalled();
      }
    });
  });

  it('should propagate non-401 errors', () => {
    const req = new HttpRequest('GET', '/api/test');

    const error = new HttpErrorResponse({status: 500});

    nextFn.mockReturnValue(
      throwError(() => error)
    );

    runInterceptor(req).subscribe({
      error: (err) => {
        expect(err).toBe(error);
      }
    });
  });
});
