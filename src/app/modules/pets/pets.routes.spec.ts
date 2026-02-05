import {PETS_ROUTES} from './pets.routes';
import {PetListComponent} from './pages/pet-list/pet-list.component';
import {PetDetailComponent} from './pages/pet-detail/pet-detail.component';
import {PetFormComponent} from './pages/pet-form/pet-form.component';

describe('PETS_ROUTES', () => {

  it('should define a route with empty path', () => {
    const route = PETS_ROUTES.find(r => r.path === '');
    expect(route).toBeTruthy();
    expect(route?.component).toBe(PetListComponent);
  });

  it('should define route for creating a new pet', () => {
    const route = PETS_ROUTES.find(r => r.path === 'novo');
    expect(route).toBeTruthy();
    expect(route?.component).toBe(PetFormComponent);
  });

  it('should define route for editing a pet', () => {
    const route = PETS_ROUTES.find(r => r.path === ':id/editar');
    expect(route).toBeTruthy();
    expect(route?.component).toBe(PetFormComponent);
  });

  it('should define route for pet details', () => {
    const route = PETS_ROUTES.find(r => r.path === ':id');
    expect(route).toBeTruthy();
    expect(route?.component).toBe(PetDetailComponent);
  });

  it('should have exactly four routes', () => {
    expect(PETS_ROUTES.length).toBe(4);
  });

});
