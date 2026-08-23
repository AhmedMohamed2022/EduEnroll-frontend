// Path: src/app/core/services/course.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { GeneralApiResponse } from '../models/api-response.model';
import { CourseCreateDto, CourseDetailsDto } from '../models/course.model';
import {
  EnrollStudentDto,
  EnrollmentDetailsDto,
} from '../models/enrollment.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.baseUrl}`;

  #coursesSignal = signal<CourseDetailsDto[]>([]);
  public courses = this.#coursesSignal.asReadonly();

  public loadCourses(): Observable<GeneralApiResponse<CourseDetailsDto[]>> {
    return this.http
      .get<GeneralApiResponse<CourseDetailsDto[]>>(`${this.baseUrl}/courses`)
      .pipe(
        tap((res) => {
          if (res.isSuccess) this.#coursesSignal.set(res.data);
        }),
      );
  }

  public createCourse(
    dto: CourseCreateDto,
  ): Observable<GeneralApiResponse<CourseDetailsDto>> {
    return this.http
      .post<
        GeneralApiResponse<CourseDetailsDto>
      >(`${this.baseUrl}/courses`, dto)
      .pipe(
        tap((res) => {
          if (res.isSuccess) {
            this.#coursesSignal.update((current) => [...current, res.data]);
          }
        }),
      );
  }

  // 🔴 THE CORE REACTIVE FRONTEND ENROLLMENT METHOD
  public enrollStudent(
    courseId: number,
  ): Observable<GeneralApiResponse<EnrollmentDetailsDto>> {
    // Pass an object payload: { courseId: courseId }
    return this.http
      .post<
        GeneralApiResponse<EnrollmentDetailsDto>
      >(`${this.baseUrl}/enrollments/enroll`, { courseId })
      .pipe(
        tap((res) => {
          if (res.isSuccess) {
            console.log('student enrolled');
            this.#coursesSignal.update((currentCourses) =>
              currentCourses.map((course) =>
                course.id === courseId
                  ? { ...course, currentEnrolled: course.currentEnrolled + 1 }
                  : course,
              ),
            );
          }
        }),
      );
  }
}
