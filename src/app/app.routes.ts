import {Routes} from '@angular/router';
import {authGuard} from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'pets',
    canActivate: [authGuard],
    loadChildren: () => import('./modules/pets/pets.routes').then(m => m.PETS_ROUTES)
  },
  {
    path: 'tutores',
    canActivate: [authGuard],
    loadChildren: () => import('./modules/tutores/tutores.routes').then(m => m.TUTORES_ROUTES)
  },
  {
    path: '',
    redirectTo: 'pets',
    pathMatch: 'full'
  },
  {
    path: 'health',
    loadChildren: () => import('./modules/health/health.routes').then(m => m.HEALTH_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'pets'
  },
];
