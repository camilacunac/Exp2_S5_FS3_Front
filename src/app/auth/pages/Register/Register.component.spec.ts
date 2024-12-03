import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { RegisterComponent } from './Register.component';
import { UsersService } from '../../services/users.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockUsersService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockUsersService = {
      addUser: jasmine.createSpy('addUser'),
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule], // Importa el componente standalone
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario con campos vacíos', () => {
    const form = component.registerForm;
    expect(form.value).toEqual({
      email: '',
      password: '',
      nombre: '',
      apellido: '',
      direccion: '',
      telefono: '',
    });
  });

  it('debería invalidar el formulario si los campos están vacíos', () => {
    const form = component.registerForm;
    expect(form.valid).toBeFalse();
  });

  it('debería validar que el campo email sea obligatorio y tenga un formato válido', () => {
    const emailControl = component.registerForm.get('email');

    emailControl?.setValue('');
    expect(emailControl?.valid).toBeFalse();
    expect(emailControl?.errors?.['required']).toBeTruthy();

    emailControl?.setValue('correo-invalido');
    expect(emailControl?.valid).toBeFalse();
    expect(emailControl?.errors?.['email']).toBeTruthy();

    emailControl?.setValue('test@correo.com');
    expect(emailControl?.valid).toBeTrue();
  });

  it('debería enviar los datos al servicio si el formulario es válido', async () => {
    const userMock = {
      correo: 'test@correo.com',
      contrasena: 'Valid@123',
      nombre: 'Nombre',
      apellido: 'Apellido',
      direccion: 'Direccion Completa',
      telefono: '123456789',
      rol: 'cliente',
    };

    component.registerForm.setValue({
      email: userMock.correo,
      password: userMock.contrasena,
      nombre: userMock.nombre,
      apellido: userMock.apellido,
      direccion: userMock.direccion,
      telefono: userMock.telefono,
    });

    mockUsersService.addUser.and.returnValue(
      Promise.resolve({ state: 'success' })
    );

    await component.onRegister();

    expect(mockUsersService.addUser).toHaveBeenCalledWith(userMock);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('debería manejar errores del servicio en caso de fallo', async () => {
    component.registerForm.setValue({
      email: 'test@correo.com',
      password: 'Valid@123',
      nombre: 'Nombre',
      apellido: 'Apellido',
      direccion: 'Direccion Completa',
      telefono: '123456789',
    });

    mockUsersService.addUser.and.returnValue(
      Promise.reject({ message: 'Error en el registro' })
    );

    await component.onRegister();

    expect(mockUsersService.addUser).toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
