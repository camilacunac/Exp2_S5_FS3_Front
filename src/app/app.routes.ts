import { Routes } from '@angular/router';
import { HomeComponent } from './store/pages/Home/Home.component';
import { RegisterComponent } from './auth/pages/Register/Register.component';
import { LoginComponent } from './auth/pages/Login/Login.component';
import { ProfileComponent } from './auth/pages/Profile/Profile.component';
import { authGuard } from './auth/guards/auth.guard';
import { RecoverPasswordComponent } from './auth/pages/RecoverPassword/RecoverPassword.component';
import { UsersComponent } from './auth/pages/Users/Users.component';
import { adminGuard } from './auth/guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'recuperar-contraseña', component: RecoverPasswordComponent },
  { path: 'perfil', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'usuarios', component: UsersComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: '' },
];
