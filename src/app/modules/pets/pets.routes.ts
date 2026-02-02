import {Routes} from '@angular/router';
import {PetListComponent} from './pages/pet-list/pet-list.component';
import {PetDetailComponent} from './pages/pet-detail/pet-detail.component';

export const PETS_ROUTES: Routes = [
  {
    path: '',
    component: PetListComponent
  },
  {path: ':id', component: PetDetailComponent}
];
