import {Routes} from '@angular/router';
import {PetListComponent} from './pages/pet-list/pet-list.component';

export const PETS_ROUTES: Routes = [
  {
    path: '',
    component: PetListComponent
  },
];
