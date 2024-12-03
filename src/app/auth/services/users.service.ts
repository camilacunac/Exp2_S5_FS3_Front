import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable } from 'rxjs';

interface User {
  correo: string;
  contrasena: string;
  nombre: string;
  apellido: string;
  direccion: string;
  telefono: string;
  rol: string;
}

interface loginRequest {
  correo: string;
  contrasena: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private users: any[] = JSON.parse(localStorage.getItem('users')!) || [];
  private currentUser: any =
    JSON.parse(localStorage.getItem('currentUser')!) || {};

  private apiUrl = 'http://localhost:8080/usuarios';

  constructor() {}

  async addUser(user: User): Promise<any> {
    try {
      const response = await axios.post(`${this.apiUrl}/registro`, user, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || 'Error desconocido';
    }
  }

  async login(loginRequest: loginRequest): Promise<any> {
    try {
      const response = await axios.post(`${this.apiUrl}/login`, loginRequest, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || 'Error desconocido';
    }
  }

  async updateCurrentUser(updatedData: any): Promise<any> {
    try {
      const userId = this.currentUser.id;
      const response = await axios.put(
        `${this.apiUrl}/actualizar/${userId}`,
        updatedData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      this.setCurrentUser(response.data.res);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || 'Error desconocido';
    }
  }

  async getAllUsers(): Promise<any[]> {
    try {
      const response = await axios.get(`${this.apiUrl}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || 'Error desconocido';
    }
  }

  async deleteUser(userId: number): Promise<any> {
    try {
      const response = await axios.delete(`${this.apiUrl}/${userId}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || 'Error desconocido';
    }
  }

  async getUserPurchases(userId: number): Promise<any> {
    try {
      const response = await axios.get(
        `http://localhost:8081/busqueda/compras/usuario/${userId}`,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return response.data.res;
    } catch (error: any) {
      throw error.response?.data || 'Error desconocido';
    }
  }

  // Obtener todos los usuarios
  getUsers() {
    return this.users;
  }

  setCurrentUser(user: any) {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
}
