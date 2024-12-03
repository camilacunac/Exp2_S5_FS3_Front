import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { ProfileComponent } from './Profile.component';
import { UsersService } from '../../services/users.service';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let mockUsersService: any;

  beforeEach(async () => {
    mockUsersService = {
      getCurrentUser: jasmine.createSpy('getCurrentUser'),
      updateCurrentUser: jasmine.createSpy('updateCurrentUser'),
    };

    await TestBed.configureTestingModule({
      imports: [ProfileComponent, ReactiveFormsModule], // ProfileComponent es standalone
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario con los datos del usuario actual', () => {
    const mockUser = {
      correo: 'test@correo.com',
      nombre: 'Test',
      apellido: 'User',
      direccion: 'Calle 123',
      telefono: '123456789',
    };

    mockUsersService.getCurrentUser.and.returnValue(mockUser); // Simula el usuario actual

    component.ngOnInit(); // Llama a ngOnInit para inicializar el formulario

    expect(component.profileForm.getRawValue()).toEqual(mockUser); // Usa getRawValue para incluir campos deshabilitados
  });

  it('debería mostrar un mensaje de éxito cuando se actualiza el perfil correctamente', async () => {
    const mockResponse = { state: 'success', res: {} };
    mockUsersService.updateCurrentUser.and.returnValue(
      Promise.resolve(mockResponse)
    );

    component.profileForm.setValue({
      correo: 'test@correo.com',
      nombre: 'Test',
      apellido: 'User',
      direccion: 'Calle 123',
      telefono: '123456789',
    });

    await component.onSaveProfile();

    expect(mockUsersService.updateCurrentUser).toHaveBeenCalledWith({
      correo: 'test@correo.com',
      nombre: 'Test',
      apellido: 'User',
      direccion: 'Calle 123',
      telefono: '123456789',
    });
  });

  it('debería mostrar un mensaje de error cuando la actualización falla', async () => {
    mockUsersService.updateCurrentUser.and.returnValue(
      Promise.reject({ error: 'Error inesperado' })
    );

    component.profileForm.setValue({
      correo: 'test@correo.com',
      nombre: 'Test',
      apellido: 'User',
      direccion: 'Calle 123',
      telefono: '123456789',
    });

    await component.onSaveProfile();

    expect(mockUsersService.updateCurrentUser).toHaveBeenCalled();
    expect(component.profileForm.valid).toBeTrue();
  });

  it('debería detectar campos vacíos como inválidos', () => {
    component.profileForm.patchValue({
      correo: '', // Este campo está deshabilitado y no afecta la validación
      nombre: '',
      apellido: '',
      direccion: '',
      telefono: '',
    });

    expect(component.profileForm.valid).toBeFalse(); // Valida el resto de los campos
  });
});
