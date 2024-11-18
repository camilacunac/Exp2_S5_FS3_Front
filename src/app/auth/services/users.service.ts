import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private users: any[] = JSON.parse(localStorage.getItem('users')!) || [];
  private currentUser: any =
    JSON.parse(localStorage.getItem('currentUser')!) || {};

  constructor() {}

  // Agregar usuario al array
  addUser(user: any) {
    this.users.push(user);
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  // Obtener todos los usuarios
  getUsers() {
    return this.users;
  }

  setCurrentUser(user: any) {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.users = this.users.map((item: any) => {
      if (user.email === item.email) {
        item = user;
      }
      return item;
    });
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  getCurrentUser() {
    return this.currentUser;
  }

  updateCurrentUser(updatedData: any) {
    this.currentUser = { ...this.currentUser, ...updatedData };
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    this.users = this.users.map((item: any) => {
      if (this.currentUser.email === item.email) {
        item = this.currentUser;
      }
      return item;
    });
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
}
