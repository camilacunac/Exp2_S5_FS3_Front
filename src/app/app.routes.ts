import { Routes } from '@angular/router';
import { HomeComponent } from './store/pages/Home/Home.component';
import { RegisterComponent } from './auth/pages/Register/Register.component';
import { LoginComponent } from './auth/pages/Login/Login.component';
import { ProfileComponent } from './auth/pages/Profile/Profile.component';
import { authGuard } from './auth/guards/auth.guard';
import { RecoverPasswordComponent } from './auth/pages/RecoverPassword/RecoverPassword.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'recuperar-contraseña', component: RecoverPasswordComponent },
  { path: 'perfil', component: ProfileComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
