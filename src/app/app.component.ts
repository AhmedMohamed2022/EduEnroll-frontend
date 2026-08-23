import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { NavbarComponent } from '../core/components/navbar/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'EduEnrollClient';
  public authService = inject(AuthService);
  private router = inject(Router);

  public onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirect straight to access gate
  }
}
