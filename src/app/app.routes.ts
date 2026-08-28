import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';
import { CourseDashboardComponent } from './features/courses/course-dashboard/course-dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: CourseDashboardComponent,
    title: 'Course Dashboard',
    canActivate: [authGuard],
    data: { layout: 'sidebar' },
  },
  {
    path: 'courses/:id',
    loadComponent: () =>
      import('./features/courses/course-detail/course-detail.component').then(
        (m) => m.CourseDetailComponent,
      ),
    title: 'Course Details',
    canActivate: [authGuard],
    data: { layout: 'sidebar' },
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent,
      ),
    title: 'Login',
    data: { layout: 'navbar' },
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(
        (m) => m.RegisterComponent,
      ),
    title: 'Register',
    data: { layout: 'navbar' },
  },
];
