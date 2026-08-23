// Path: src/app/features/auth/register.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Path: src/app/features/auth/register.component.ts
  public registrationData = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    userType: 'Student',
  };

  public errorMessage = signal<string | null>(null);

  public onRegisterSubmit(): void {
    this.errorMessage.set(null);
    this.authService.register(this.registrationData).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.router.navigate(['/']);
        } else {
          this.errorMessage.set(res.errors.join(', '));
        }
      },
      error: (err) => {
        const backendErrors = err.error?.errors;
        this.errorMessage.set(
          backendErrors
            ? backendErrors.join(', ')
            : 'Registration process failed.',
        );
      },
    });
  }
}
