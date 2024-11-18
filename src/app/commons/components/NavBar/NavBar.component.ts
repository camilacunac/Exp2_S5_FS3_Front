import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './NavBar.component.html',
  styleUrl: './NavBar.component.css',
})
export class NavBarComponent {
  isLoggedIn: boolean = localStorage.getItem('isLoggedIn') === 'true';

  toggleLogin() {
    if (this.isLoggedIn) {
      localStorage.removeItem('isLoggedIn');
    } else {
      localStorage.setItem('isLoggedIn', 'true');
    }
    this.isLoggedIn = !this.isLoggedIn;
  }
}
