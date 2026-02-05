import {TUTORES_ROUTES} from './tutores.routes';
import {TutorListComponent} from './pages/tutor-list/tutor-list.component';
import {TutorDetailComponent} from './pages/tutor-detail/tutor-detail.component';
import {TutorFormComponent} from './pages/tutor-form/tutor-form.component';

describe('TUTORES_ROUTES', () => {

  it('should define a route with empty path', () => {
    const route = TUTORES_ROUTES.find(r => r.path === '');
    expect(route).toBeTruthy();
    expect(route?.component).toBe(TutorListComponent);
  });

  it('should define route for creating a new tutor', () => {
    const route = TUTORES_ROUTES.find(r => r.path === 'novo');
    expect(route).toBeTruthy();
    expect(route?.component).toBe(TutorFormComponent);
  });

  it('should define route for editing a tutor', () => {
    const route = TUTORES_ROUTES.find(r => r.path === ':id/editar');
    expect(route).toBeTruthy();
    expect(route?.component).toBe(TutorFormComponent);
  });

  it('should define route for tutor details', () => {
    const route = TUTORES_ROUTES.find(r => r.path === ':id');
    expect(route).toBeTruthy();
    expect(route?.component).toBe(TutorDetailComponent);
  });

  it('should have exactly four routes', () => {
    expect(TUTORES_ROUTES.length).toBe(4);
  });

});
