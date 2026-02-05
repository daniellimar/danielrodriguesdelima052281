import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {authGuard} from './auth.guard';
import {AuthFacade} from '../facades/auth.facade';

describe('authGuard', () => {
  let routerMock: { createUrlTree: ReturnType<typeof vi.fn> };
  let authFacadeMock: any;

  beforeEach(() => {
    routerMock = {
      createUrlTree: vi.fn()
    };

    authFacadeMock = {};

    TestBed.configureTestingModule({
      providers: [
        {provide: Router, useValue: routerMock},
        {provide: AuthFacade, useValue: authFacadeMock}
      ]
    });
  });

  it('should return true when access token exists', () => {
    Object.defineProperty(authFacadeMock, 'currentAccessToken', {
      configurable: true,
      get: () => 'fake-token'
    });

    const result = TestBed.runInInjectionContext(() => authGuard());

    expect(result).toBe(true);
  });

  it('should redirect to /auth/login when access token does not exist', () => {
    Object.defineProperty(authFacadeMock, 'currentAccessToken', {
      configurable: true,
      get: () => null
    });

    const fakeUrlTree = {} as any;
    routerMock.createUrlTree.mockReturnValue(fakeUrlTree);

    const result = TestBed.runInInjectionContext(() => authGuard());

    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/auth/login']);
    expect(result).toBe(fakeUrlTree);
  });
});
