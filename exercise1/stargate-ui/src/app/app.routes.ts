import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'persons', loadComponent: () => import('./components/persons/persons.component').then(m => m.PersonsComponent) },
  { path: 'astronauts', loadComponent: () => import('./components/astronauts/astronauts.component').then(m => m.AstronautsComponent) },
  { path: 'duties', loadComponent: () => import('./components/duties/duties.component').then(m => m.DutiesComponent) }
];
