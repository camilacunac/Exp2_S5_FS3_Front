import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './RecoverPassword.component.html',
  styleUrl: './RecoverPassword.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecoverPasswordComponent {}
