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
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
          ),
        ],
      ],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
    });
  }

  onRegister() {
    if (this.registerForm.valid) {
      this.userService.addUser(this.registerForm.value);
      this.registerForm.reset();

      alert('Registro exitoso! Serás redirigido al login.');

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1000);
    }
  }
}
