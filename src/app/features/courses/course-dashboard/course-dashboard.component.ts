// Path: src/app/features/courses/course-dashboard.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../../core/services/course.service';
import { CourseCreateDto } from '../../../../core/models/course.model';

@Component({
  selector: 'app-course-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-dashboard.component.html',
})
export class CourseDashboardComponent implements OnInit {
  private courseService = inject(CourseService);

  public coursesList = this.courseService.courses;
  public newCourse: CourseCreateDto = {
    title: '',
    description: '',
    capacity: 20,
    price: 0,
  };

  public errorMessage = signal<string | null>(null);
  public successMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.courseService.loadCourses().subscribe({
      error: () => this.errorMessage.set('Failed to pull server registries.'),
    });
  }

  public onFormSubmit(): void {
    this.clearMessages();
    this.courseService.createCourse(this.newCourse).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.newCourse = {
            title: '',
            description: '',
            capacity: 20,
            price: 0,
          };
          this.successMessage.set('Course successfully registered!');
        } else {
          this.errorMessage.set(res.errors.join(', '));
        }
      },
      error: () =>
        this.errorMessage.set('An error occurred during submission.'),
    });
  }

  // 🔴 TRIGGER THE BACKEND CAPACITY VERIFICATION HOOK
  public onEnrollClick(courseId: number): void {
    this.clearMessages();

    // Passing studentId: 1 for local development mapping until Auth slice is implemented
    this.courseService.enrollStudent({ studentId: 1, courseId }).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.successMessage.set('Successfully enrolled in the course!');
        } else {
          // Captures "Course Full" or "Already Enrolled" custom business exceptions gracefully
          this.errorMessage.set(res.errors.join(', '));
        }
      },
      error: (err) => {
        const backendErrors = err.error?.errors;
        this.errorMessage.set(
          backendErrors
            ? backendErrors.join(', ')
            : 'Enrollment execution failed.',
        );
      },
    });
  }

  private clearMessages(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }
}
