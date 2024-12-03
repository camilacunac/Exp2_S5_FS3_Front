import type { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const userService = inject(UsersService);
  const router = inject(Router);

  const currentUser = userService.getCurrentUser();

  if (currentUser?.rol === 'admin') {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};
