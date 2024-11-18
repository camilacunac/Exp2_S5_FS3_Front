import type { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UsersService);
  const router = inject(Router);

  if (userService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
