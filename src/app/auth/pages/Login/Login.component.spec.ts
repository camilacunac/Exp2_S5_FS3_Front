import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './Login.component';
import { UsersService } from '../../services/users.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockUsersService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockUsersService = {
      login: jasmine.createSpy('login'),
      setCurrentUser: jasmine.createSpy('setCurrentUser'),
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule], // LoginComponent es standalone
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario con campos vacíos', () => {
    const form = component.loginForm;
    expect(form.value).toEqual({ email: '', password: '' });
    expect(form.valid).toBeFalse();
  });

  it('debería validar que el campo email sea obligatorio y tenga un formato válido', () => {
    const emailControl = component.loginForm.get('email');

    emailControl?.setValue('');
    expect(emailControl?.valid).toBeFalse();
    expect(emailControl?.errors?.['required']).toBeTruthy();

    emailControl?.setValue('correo-invalido');
    expect(emailControl?.valid).toBeFalse();
    expect(emailControl?.errors?.['email']).toBeTruthy();

    emailControl?.setValue('test@correo.com');
    expect(emailControl?.valid).toBeTrue();
  });

  it('debería validar que el campo password sea obligatorio', () => {
    const passwordControl = component.loginForm.get('password');

    passwordControl?.setValue('');
    expect(passwordControl?.valid).toBeFalse();
    expect(passwordControl?.errors?.['required']).toBeTruthy();

    passwordControl?.setValue('password123');
    expect(passwordControl?.valid).toBeTrue();
  });

  it('debería llamar al servicio de login y redirigir en caso de éxito', async () => {
    const loginResponse = {
      state: 'success',
      res: { correo: 'test@correo.com' },
    };
    mockUsersService.login.and.returnValue(Promise.resolve(loginResponse));

    component.loginForm.setValue({
      email: 'test@correo.com',
      password: 'Valid@123',
    });

    await component.onLogin();

    expect(mockUsersService.login).toHaveBeenCalledWith({
      correo: 'test@correo.com',
      contrasena: 'Valid@123',
    });
    expect(mockUsersService.setCurrentUser).toHaveBeenCalledWith(
      loginResponse.res
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    expect(component.loginError).toBeFalse();
  });

  it('debería manejar errores de login (credenciales incorrectas)', async () => {
    mockUsersService.login.and.returnValue(
      Promise.reject({ state: 'error', message: 'Credenciales inválidas' })
    );

    component.loginForm.setValue({
      email: 'test@correo.com',
      password: 'InvalidPassword',
    });

    await component.onLogin();

    expect(mockUsersService.login).toHaveBeenCalledWith({
      correo: 'test@correo.com',
      contrasena: 'InvalidPassword',
    });
    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(component.loginError).toBeTrue();
  });

  it('debería manejar errores inesperados del backend', async () => {
    mockUsersService.login.and.returnValue(
      Promise.reject({ message: 'Error inesperado' })
    );

    component.loginForm.setValue({
      email: 'test@correo.com',
      password: 'AnyPassword',
    });

    await component.onLogin();

    expect(mockUsersService.login).toHaveBeenCalled();
    expect(component.loginError).toBeTrue();
  });
});
