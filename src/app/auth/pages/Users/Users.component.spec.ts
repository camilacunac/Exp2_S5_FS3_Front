import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersComponent } from './Users.component';
import { UsersService } from '../../services/users.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ModalComponent } from '../../../commons/components/Modal/Modal.component';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UsersService', [
      'getAllUsers',
      'deleteUser',
      'getUserPurchases',
    ]);

    await TestBed.configureTestingModule({
      imports: [UsersComponent, ModalComponent],
      providers: [{ provide: UsersService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    usersServiceSpy = TestBed.inject(
      UsersService
    ) as jasmine.SpyObj<UsersService>;
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar usuarios con rol "cliente" al inicializar', async () => {
    const mockUsers = [
      { id: 1, correo: 'test1@example.com', rol: 'admin' },
      { id: 2, correo: 'test2@example.com', rol: 'cliente' },
    ];
    usersServiceSpy.getAllUsers.and.returnValue(Promise.resolve(mockUsers));

    await component.fetchUsers();
    expect(component.users.length).toBe(1);
    expect(component.users[0].correo).toBe('test2@example.com');
  });

  it('debería manejar errores al cargar usuarios', async () => {
    usersServiceSpy.getAllUsers.and.returnValue(
      Promise.reject('Error al cargar')
    );
    await component.fetchUsers();
    expect(component.errorMessage).toBe('Error al cargar los usuarios.');
    expect(component.loading).toBeFalse();
  });

  it('debería mostrar compras del usuario en el modal', async () => {
    const mockPurchases = [
      {
        idCompra: 1,
        fechaCompra: '2024-11-27',
        total: 100.0,
        estado: 'Pendiente',
        detalles: [],
      },
    ];
    usersServiceSpy.getUserPurchases.and.returnValue(
      Promise.resolve(mockPurchases)
    );

    await component.viewUserPurchases(2);

    expect(component.purchases).toEqual(mockPurchases);
    expect(component.isModalVisible).toBeTrue();
    expect(component.modalTitle).toBe('Compras del Usuario');
  });

  it('debería manejar errores al cargar compras del usuario', async () => {
    spyOn(window, 'alert');
    usersServiceSpy.getUserPurchases.and.returnValue(
      Promise.reject({ error: 'Error al cargar' })
    );

    await component.viewUserPurchases(2);

    expect(window.alert).toHaveBeenCalledWith(
      'Ocurrió un error al cargar las compras: Error al cargar'
    );
  });

  it('debería cerrar el modal', () => {
    component.isModalVisible = true;

    component.closeModal();

    expect(component.isModalVisible).toBeFalse();
  });

  it('debería confirmar la eliminación y eliminar el usuario correctamente', async () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert');
    const mockUsers = [{ id: 1, correo: 'test1@example.com', rol: 'cliente' }];
    component.users = [...mockUsers];
    usersServiceSpy.deleteUser.and.returnValue(
      Promise.resolve({ state: 'success' })
    );

    await component.deleteUser(1);

    expect(usersServiceSpy.deleteUser).toHaveBeenCalledWith(1);
    expect(component.users.length).toBe(0);
    expect(window.alert).toHaveBeenCalledWith(
      'Usuario eliminado exitosamente.'
    );
  });

  it('debería manejar errores al eliminar un usuario', async () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert');
    const mockUsers = [{ id: 1, correo: 'test1@example.com', rol: 'cliente' }];
    component.users = [...mockUsers];
    usersServiceSpy.deleteUser.and.returnValue(
      Promise.reject({ error: 'Error al eliminar' })
    );

    await component.deleteUser(1);

    expect(usersServiceSpy.deleteUser).toHaveBeenCalledWith(1);
    expect(component.users.length).toBe(1);
    expect(window.alert).toHaveBeenCalledWith(
      'Ocurrió un error: Error al eliminar'
    );
  });
});
