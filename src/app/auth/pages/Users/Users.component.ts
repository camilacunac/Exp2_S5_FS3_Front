import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../../commons/components/Modal/Modal.component';
import { NavBarComponent } from '../../../commons/components/NavBar/NavBar.component';
import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, NavBarComponent, ModalComponent],
  templateUrl: './Users.component.html',
  styleUrls: ['./Users.component.css'],
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  purchases: any[] = [];
  isModalVisible = false;
  modalTitle = '';
  loading = true;
  errorMessage = '';

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.fetchUsers();
  }

  async fetchUsers() {
    try {
      const response = await this.usersService.getAllUsers();
      this.users = response.filter((user: any) => user.rol === 'cliente');
      this.loading = false;
    } catch (error: any) {
      this.errorMessage = 'Error al cargar los usuarios.';
      this.loading = false;
    }
  }

  async deleteUser(userId: number) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        const response = await this.usersService.deleteUser(userId);
        if (response.state === 'success') {
          alert('Usuario eliminado exitosamente.');
          this.users = this.users.filter((user) => user.id !== userId);
        } else {
          alert(`Error al eliminar el usuario: ${response.message}`);
        }
      } catch (error: any) {
        alert(`Ocurrió un error: ${error.error || 'Error desconocido'}`);
      }
    }
  }

  async viewUserPurchases(userId: number) {
    try {
      const response = await this.usersService.getUserPurchases(userId);
      this.purchases = response; // Asigna las compras al modal
      this.modalTitle = 'Compras del Usuario';
      this.isModalVisible = true; // Muestra el modal
    } catch (error: any) {
      alert(
        `Ocurrió un error al cargar las compras: ${
          error.error || 'Error desconocido'
        }`
      );
    }
  }

  closeModal() {
    this.isModalVisible = false;
  }
}
