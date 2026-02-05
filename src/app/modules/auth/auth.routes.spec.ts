import {AUTH_ROUTES} from './auth.routes';
import {Login} from './pages/login/login.component';

describe('AUTH_ROUTES', () => {

  it('should be defined', () => {
    expect(AUTH_ROUTES).toBeDefined();
  });

  it('should contain a login route', () => {
    const loginRoute = AUTH_ROUTES.find(route => route.path === 'login');

    expect(loginRoute).toBeTruthy();
    expect(loginRoute?.component).toBe(Login);
  });

  it('should contain a default redirect route', () => {
    const redirectRoute = AUTH_ROUTES.find(route => route.path === '');

    expect(redirectRoute).toBeTruthy();
    expect(redirectRoute?.redirectTo).toBe('login');
    expect(redirectRoute?.pathMatch).toBe('full');
  });

  it('should have exactly two routes configured', () => {
    expect(AUTH_ROUTES.length).toBe(2);
  });

});
