// Path: src/app/core/services/course.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { GeneralApiResponse } from '../models/api-response.model';
import { CourseCreateDto, CourseDetailsDto } from '../models/course.model';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private http = inject(HttpClient);
  private baseUrl = '${environment.baseUrl}/courses';

  // State Management via high performance Angular Signals Graph
  #coursesSignal = signal<CourseDetailsDto[]>([]);
  public courses = this.#coursesSignal.asReadonly();

  public loadCourses(): Observable<GeneralApiResponse<CourseDetailsDto[]>> {
    return this.http
      .get<GeneralApiResponse<CourseDetailsDto[]>>(this.baseUrl)
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
      .post<GeneralApiResponse<CourseDetailsDto>>(this.baseUrl, dto)
      .pipe(
        tap((res) => {
          if (res.isSuccess) {
            // Push element into the signal array cleanly via immutable updates!
            this.#coursesSignal.update((current) => [...current, res.data]);
          }
        }),
      );
  }
}
