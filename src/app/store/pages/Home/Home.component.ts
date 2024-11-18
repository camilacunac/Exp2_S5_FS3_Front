import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavBarComponent } from '../../../commons/components/NavBar/NavBar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavBarComponent],
  templateUrl: './Home.component.html',
  styleUrl: './Home.component.css',
})
export class HomeComponent {}
