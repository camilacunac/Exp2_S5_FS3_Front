import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UsersService } from '../../services/users.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NavBarComponent } from '../../../commons/components/NavBar/NavBar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavBarComponent],
  templateUrl: './Profile.component.html',
  styleUrl: './Profile.component.css',
})
export class ProfileComponent {
  profileForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UsersService) {
    this.profileForm = this.fb.group({
      correo: [{ value: '', disabled: true }], // Correo no es requerido ya que está deshabilitado
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('\\d{9,}')]],
    });
  }

  ngOnInit() {
    const user = this.userService.getCurrentUser(); // Método en el servicio para obtener el usuario actual
    if (user) {
      this.profileForm.patchValue(user);
    }
  }

  async onSaveProfile() {
    if (this.profileForm.valid) {
      try {
        const updatedData = this.profileForm.getRawValue(); // Obtiene los datos incluso si están deshabilitados
        const response = await this.userService.updateCurrentUser(updatedData); // Llama al servicio

        if (response.state === 'success') {
          alert('Perfil actualizado exitosamente.');
        } else {
          alert(`Error al actualizar el perfil: ${response.data.error}`);
        }
      } catch (error: any) {
        console.log('Error al actualizar el perfil:', error);
        alert(
          `Ocurrió un error al actualizar el perfil: ${
            error.error || 'Error desconocido'
          }`
        );
      }
    }
  }
}
