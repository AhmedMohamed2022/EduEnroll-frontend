// Path: src/app/core/services/auth.service.ts
import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { GeneralApiResponse } from '../models/api-response.model';
import { AuthResponseDto } from '../models/auth.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.baseUrl}/auth`;

  // State Management via high performance Angular Signals Graph
  #currentUserSignal = signal<AuthResponseDto | null>(this.getStoredUser());

  // Expose state as read-only to prevent component manipulation
  public currentUser = this.#currentUserSignal.asReadonly();
  public isAuthenticated = computed(() => this.#currentUserSignal() !== null);
  // Path: src/app/core/services/auth.service.ts

  // 🔴 ADDED: Computed boolean tracking matching role parameters from active signals
  public isInstructor = computed(
    () => this.currentUser()?.userType === 'Instructor',
  );
  public isStudent = computed(() => this.currentUser()?.userType === 'Student');

  public login(dto: any): Observable<GeneralApiResponse<AuthResponseDto>> {
    return this.http
      .post<GeneralApiResponse<AuthResponseDto>>(`${this.baseUrl}/login`, dto)
      .pipe(
        tap((res) => {
          if (res.isSuccess) this.setSession(res.data);
        }),
      );
  }

  public register(dto: any): Observable<GeneralApiResponse<AuthResponseDto>> {
    return this.http
      .post<
        GeneralApiResponse<AuthResponseDto>
      >(`${this.baseUrl}/register`, dto)
      .pipe(
        tap((res) => {
          if (res.isSuccess) this.setSession(res.data);
        }),
      );
  }

  public logout(): void {
    localStorage.removeItem('edu_enroll_user');
    this.#currentUserSignal.set(null);
  }

  private setSession(user: AuthResponseDto): void {
    localStorage.setItem('edu_enroll_user', JSON.stringify(user));
    this.#currentUserSignal.set(user);
  }

  private getStoredUser(): AuthResponseDto | null {
    const userJson = localStorage.getItem('edu_enroll_user');
    return userJson ? JSON.parse(userJson) : null;
  }
}
