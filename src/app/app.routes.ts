import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/courses/course-dashboard/course-dashboard.component').then(
        (m) => m.CourseDashboardComponent,
      ),
  },
];
