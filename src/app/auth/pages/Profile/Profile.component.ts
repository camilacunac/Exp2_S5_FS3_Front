import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
      email: [{ value: '', disabled: true }],
      nombre: [''],
      apellido: [''],
      direccion: [''],
      telefono: [''],
    });
  }

  ngOnInit() {
    const user = this.userService.getCurrentUser(); // Método en el servicio para obtener el usuario actual
    if (user) {
      this.profileForm.patchValue(user);
    }
  }

  onSaveProfile() {
    if (this.profileForm.valid) {
      this.userService.updateCurrentUser(this.profileForm.value); // Método en el servicio para actualizar el usuario
      alert('Perfil actualizado exitosamente.');
    }
  }
}
