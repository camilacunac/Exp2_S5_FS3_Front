import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';

interface User {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  direccion: string;
  telefono: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './Register.component.html',
  styleUrl: './Register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;
  users: User[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UsersService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(15),
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};\'":\\\\|,.<>\\/?])[A-Za-z\\d!@#$%^&*()_+\\-=\\[\\]{};\'":\\\\|,.<>\\/?]{8,15}$'
          ),
        ],
      ],
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      apellido: ['', [Validators.required, Validators.minLength(5)]],
      direccion: ['', [Validators.required, Validators.minLength(15)]],
      telefono: ['', [Validators.required, Validators.pattern('^\\d{9,}$')]],
    });
  }

  onRegister() {
    if (this.registerForm.valid) {
      const user = {
        correo: this.registerForm.value.email,
        contrasena: this.registerForm.value.password,
        nombre: this.registerForm.value.nombre,
        apellido: this.registerForm.value.apellido,
        direccion: this.registerForm.value.direccion,
        telefono: this.registerForm.value.telefono,
        rol: 'cliente',
      };

      this.userService
        .addUser(user)
        .then((response) => {
          if (response.state === 'success') {
            alert('Registro exitoso! Serás redirigido al login.');
            this.registerForm.reset();
            this.router.navigate(['/login']);
          } else {
            alert(`Error: ${response.message}`);
          }
        })
        .catch((error) => {
          alert(`Ocurrió un error: ${error.message || 'Error desconocido'}`);
        });
    }
  }
}
