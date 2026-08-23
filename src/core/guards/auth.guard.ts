import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Read the token presence directly from our high-performance signal graph
  if (authService.isAuthenticated()) {
    return true; // Token validated! Allow entry.
  }

  // Intercept unauthorized navigation and push them to the access gate
  router.navigate(['/login']);
  return false;
};
