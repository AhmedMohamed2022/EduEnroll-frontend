// Path: src/app/core/components/sidebar/sidebar.component.ts
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  public authService = inject(AuthService);
  private router = inject(Router);

  public onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
