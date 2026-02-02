import {Routes} from '@angular/router';
import {TutorListComponent} from './pages/tutor-list/tutor-list.component';
import {TutorDetailComponent} from './pages/tutor-detail/tutor-detail.component';
import {TutorFormComponent} from './pages/tutor-form/tutor-form.component';

export const TUTORES_ROUTES: Routes = [
  {path: '', component: TutorListComponent},
  {path: 'novo', component: TutorFormComponent},
  {path: ':id/editar', component: TutorFormComponent},
  {path: ':id', component: TutorDetailComponent}
];
