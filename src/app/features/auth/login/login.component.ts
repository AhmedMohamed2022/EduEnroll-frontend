// Path: src/app/features/auth/login.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  public credentials = { email: '', password: '' };
  public errorMessage = signal<string | null>(null);

  public onLoginSubmit(): void {
    this.errorMessage.set(null);
    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.router.navigate(['/']); // Route straight back to main dashboard
        } else {
          this.errorMessage.set(res.errors.join(', '));
        }
      },
      error: (err) => {
        const backendErrors = err.error?.errors;
        this.errorMessage.set(
          backendErrors ? backendErrors.join(', ') : 'Authentication failed.',
        );
      },
    });
  }
}
