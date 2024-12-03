import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './Login.component.html',
  styleUrl: './Login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UsersService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async onLogin() {
    const { email, password } = this.loginForm.value;

    try {
      const response = await this.userService.login({
        correo: email,
        contrasena: password,
      });

      if (response.state === 'success') {
        localStorage.setItem('isLoggedIn', 'true');
        this.userService.setCurrentUser(response.res);
        this.router.navigate(['/']);
      } else {
        this.loginError = true;
      }
    } catch (error: any) {
      console.error('Error durante el login:', error);
      this.loginError = true;
    }
  }
}
