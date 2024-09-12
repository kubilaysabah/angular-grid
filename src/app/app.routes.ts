import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/list.component').then(c => c.ListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./detail/detail.component').then(c => c.DetailComponent),
  }
];
