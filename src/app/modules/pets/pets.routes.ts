import {Routes} from '@angular/router';
import {PetListComponent} from './pages/pet-list/pet-list.component';
import {PetDetailComponent} from './pages/pet-detail/pet-detail.component';
import {PetFormComponent} from './pages/pet-form/pet-form.component';

export const PETS_ROUTES: Routes = [
  {
    path: '',
    component: PetListComponent
  },
  {path: 'novo', component: PetFormComponent},
  {path: ':id/editar', component: PetFormComponent},
  {path: ':id', component: PetDetailComponent},
];
