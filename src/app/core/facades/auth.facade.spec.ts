import {TestBed, fakeAsync, tick} from '@angular/core/testing';
import {Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {vi} from 'vitest';

import {AuthFacade} from './auth.facade';
import {AuthService} from '../services/auth.service';
import {LoginRequest} from '../models/auth.model';

describe('AuthFacade', () => {
  let facade: AuthFacade;
  let authService: {
    login: ReturnType<typeof vi.fn>;
    refreshToken: ReturnType<typeof vi.fn>;
  };
  let router: {
    navigate: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    authService = {
      login: vi.fn(),
      refreshToken: vi.fn()
    };

    router = {
      navigate: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        AuthFacade,
        {provide: AuthService, useValue: authService},
        {provide: Router, useValue: router}
      ]
    });

    localStorage.clear();
    facade = TestBed.inject(AuthFacade);
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  // =========================
  // AUTH STATE
  // =========================

  it('should start unauthenticated when no token exists', () => {
    expect(facade.isAuthenticated).toBeFalsy();
  });

  // =========================
  // LOGIN
  // =========================

  it('should login, save tokens and navigate', () => {
    authService.login.mockReturnValue(
      of({
        access_token: 'access',
        refresh_token: 'refresh',
        expires_in: 120
      })
    );

    const credentials = {} as LoginRequest; // respeita o contrato real

    facade.login(credentials).subscribe();

    expect(authService.login).toHaveBeenCalled();
    expect(localStorage.getItem('access_token')).toBe('access');
    expect(localStorage.getItem('refresh_token')).toBe('refresh');
    expect(router.navigate).toHaveBeenCalledWith(['/pets']);
  });

  // =========================
  // LOGOUT
  // =========================

  it('should clear tokens and redirect on logout', () => {
    localStorage.setItem('access_token', 'access');
    localStorage.setItem('refresh_token', 'refresh');

    facade.logout();

    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('refresh_token')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  // =========================
  // REFRESH TOKEN
  // =========================

  it('should logout and throw when refresh token is missing', () => {
    expect(() => facade.refreshToken()).toThrow();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  // =========================
  // INITIALIZATION
  // =========================

  it('should not refresh token on app start when unauthenticated', () => {
    facade.initializeOnAppStart();
    expect(authService.refreshToken).not.toHaveBeenCalled();
  });
});
