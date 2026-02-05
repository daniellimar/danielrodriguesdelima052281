import {HEALTH_ROUTES} from './health.routes';
import {HealthComponent} from './pages/health/health.component';

describe('HEALTH_ROUTES', () => {

  it('should define a route with empty path', () => {
    const route = HEALTH_ROUTES.find(r => r.path === '');
    expect(route).toBeTruthy();
  });

  it('should map empty path to HealthComponent', () => {
    const route = HEALTH_ROUTES.find(r => r.path === '');
    expect(route?.component).toBe(HealthComponent);
  });

  it('should have exactly one route', () => {
    expect(HEALTH_ROUTES.length).toBe(1);
  });
});
