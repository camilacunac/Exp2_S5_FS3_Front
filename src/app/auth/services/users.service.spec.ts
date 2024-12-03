import { TestBed } from '@angular/core/testing';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let mockAxios: MockAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsersService],
    });
    service = TestBed.inject(UsersService);
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  it('debería agregar un usuario correctamente', async () => {
    const mockUser = {
      correo: 'test@example.com',
      contrasena: 'Password1!',
      nombre: 'Test',
      apellido: 'User',
      direccion: 'Calle Falsa 123',
      telefono: '123456789',
      rol: 'cliente',
    };

    mockAxios.onPost('http://localhost:8080/usuarios/registro').reply(200, {
      state: 'success',
      res: mockUser,
    });

    const response = await service.addUser(mockUser);
    expect(response.state).toBe('success');
    expect(response.res).toEqual(mockUser);
  });

  it('debería manejar errores al agregar un usuario', async () => {
    const mockUser = {
      correo: 'test@example.com',
      contrasena: 'Password1!',
      nombre: 'Test',
      apellido: 'User',
      direccion: 'Calle Falsa 123',
      telefono: '123456789',
      rol: 'cliente',
    };

    mockAxios.onPost('http://localhost:8080/usuarios/registro').reply(400, {
      state: 'error',
      error: 'Correo ya registrado',
    });

    await expectAsync(service.addUser(mockUser)).toBeRejectedWith(
      jasmine.objectContaining({
        state: 'error',
        error: 'Correo ya registrado',
      })
    );
  });

  it('debería iniciar sesión correctamente', async () => {
    const loginRequest = {
      correo: 'test@example.com',
      contrasena: 'Password1!',
    };
    const mockResponse = {
      state: 'success',
      res: { id: 1, correo: 'test@example.com', rol: 'cliente' },
    };

    mockAxios
      .onPost('http://localhost:8080/usuarios/login')
      .reply(200, mockResponse);

    const response = await service.login(loginRequest);
    expect(response.state).toBe('success');
    expect(response.res.correo).toBe('test@example.com');
  });

  it('debería manejar errores al iniciar sesión', async () => {
    const loginRequest = {
      correo: 'wrong@example.com',
      contrasena: 'Password1!',
    };

    mockAxios.onPost('http://localhost:8080/usuarios/login').reply(404, {
      state: 'error',
      error: 'Usuario no encontrado',
    });

    await expectAsync(service.login(loginRequest)).toBeRejectedWith(
      jasmine.objectContaining({
        state: 'error',
        error: 'Usuario no encontrado',
      })
    );
  });

  it('debería actualizar el usuario actual correctamente', async () => {
    const updatedData = { nombre: 'Nuevo Nombre', apellido: 'Nuevo Apellido' };
    const mockResponse = {
      state: 'success',
      res: { ...updatedData, id: 1, correo: 'test@example.com' },
    };

    mockAxios
      .onPut('http://localhost:8080/usuarios/actualizar/1')
      .reply(200, mockResponse);

    service.setCurrentUser({ id: 1, correo: 'test@example.com' });
    const response = await service.updateCurrentUser(updatedData);
    expect(response.state).toBe('success');
    expect(response.res.nombre).toBe('Nuevo Nombre');
  });

  it('debería manejar errores al actualizar el usuario actual', async () => {
    const updatedData = { nombre: 'Nuevo Nombre', apellido: 'Nuevo Apellido' };

    mockAxios.onPut('http://localhost:8080/usuarios/actualizar/1').reply(500, {
      state: 'error',
      error: 'Error interno',
    });

    service.setCurrentUser({ id: 1, correo: 'test@example.com' });
    await expectAsync(service.updateCurrentUser(updatedData)).toBeRejectedWith(
      jasmine.objectContaining({ state: 'error', error: 'Error interno' })
    );
  });

  it('debería obtener todos los usuarios', async () => {
    const mockUsers = [
      { id: 1, correo: 'admin@example.com', rol: 'admin' },
      { id: 2, correo: 'cliente@example.com', rol: 'cliente' },
    ];

    mockAxios.onGet('http://localhost:8080/usuarios').reply(200, mockUsers);

    const users = await service.getAllUsers();
    expect(users.length).toBe(2);
    expect(users[1].correo).toBe('cliente@example.com');
  });

  it('debería manejar errores al obtener todos los usuarios', async () => {
    mockAxios.onGet('http://localhost:8080/usuarios').reply(500, {
      state: 'error',
      error: 'Error interno',
    });

    await expectAsync(service.getAllUsers()).toBeRejectedWith(
      jasmine.objectContaining({ state: 'error', error: 'Error interno' })
    );
  });

  it('debería eliminar un usuario correctamente', async () => {
    const userId = 1;
    const mockResponse = {
      state: 'success',
      message: 'Usuario eliminado exitosamente',
    };

    mockAxios
      .onDelete(`http://localhost:8080/usuarios/${userId}`)
      .reply(200, mockResponse);

    const response = await service.deleteUser(userId);
    expect(response.state).toBe('success');
    expect(response.message).toBe('Usuario eliminado exitosamente');
  });

  it('debería manejar errores al eliminar un usuario', async () => {
    const userId = 2;

    mockAxios.onDelete(`http://localhost:8080/usuarios/${userId}`).reply(404, {
      state: 'error',
      error: 'Usuario no encontrado',
    });

    await expectAsync(service.deleteUser(userId)).toBeRejectedWith(
      jasmine.objectContaining({
        state: 'error',
        error: 'Usuario no encontrado',
      })
    );
  });

  it('debería obtener las compras de un usuario correctamente', async () => {
    const userId = 1;
    const mockPurchases = [
      {
        idCompra: 1,
        fechaCompra: '2024-11-27',
        total: 100.0,
        estado: 'Pendiente',
        detalles: [],
      },
    ];

    mockAxios
      .onGet(`http://localhost:8081/busqueda/compras/usuario/${userId}`)
      .reply(200, { state: 'success', res: mockPurchases });

    const purchases = await service.getUserPurchases(userId);
    expect(purchases).toEqual(mockPurchases);
  });

  it('debería manejar errores al obtener las compras de un usuario', async () => {
    const userId = 2;

    mockAxios
      .onGet(`http://localhost:8081/busqueda/compras/usuario/${userId}`)
      .reply(500, { state: 'error', error: 'Error al cargar las compras' });

    await expectAsync(service.getUserPurchases(userId)).toBeRejectedWith(
      jasmine.objectContaining({
        state: 'error',
        error: 'Error al cargar las compras',
      })
    );
  });

  it('debería establecer y obtener el usuario actual correctamente', () => {
    const mockUser = { id: 1, correo: 'cliente@example.com', rol: 'cliente' };

    service.setCurrentUser(mockUser);
    const currentUser = service.getCurrentUser();

    expect(currentUser).toEqual(mockUser);
  });

  it('debería verificar correctamente si el usuario está logueado', () => {
    localStorage.setItem('isLoggedIn', 'true');
    expect(service.isLoggedIn()).toBeTrue();

    localStorage.removeItem('isLoggedIn');
    expect(service.isLoggedIn()).toBeFalse();
  });
});
