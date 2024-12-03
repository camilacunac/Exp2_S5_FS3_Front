import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { adminGuard } from './admin.guard';

describe('adminGuard', () => {
  let mockRouter: jasmine.SpyObj<Router>;
  let mockUsersService: jasmine.SpyObj<UsersService>;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockUsersService = jasmine.createSpyObj('UsersService', ['getCurrentUser']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: UsersService, useValue: mockUsersService },
      ],
    });
  });

  it('debería permitir el acceso si el usuario tiene rol admin', () => {
    // Arrange
    mockUsersService.getCurrentUser.and.returnValue({ rol: 'admin' });

    const canActivate = TestBed.runInInjectionContext(() =>
      adminGuard(null as any, null as any)
    );

    // Assert
    expect(canActivate).toBeTrue();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('debería bloquear el acceso si el usuario no tiene rol admin', () => {
    // Arrange
    mockUsersService.getCurrentUser.and.returnValue({ rol: 'cliente' });

    const canActivate = TestBed.runInInjectionContext(() =>
      adminGuard(null as any, null as any)
    );

    // Assert
    expect(canActivate).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('debería bloquear el acceso si no hay un usuario logueado', () => {
    // Arrange
    mockUsersService.getCurrentUser.and.returnValue(null);

    const canActivate = TestBed.runInInjectionContext(() =>
      adminGuard(null as any, null as any)
    );

    // Assert
    expect(canActivate).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});
