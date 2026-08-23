// Path: src/app/features/courses/course-detail/course-detail.component.ts
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../../../core/services/course.service';
import { CourseDetailsDto } from '../../../../core/models/course.model';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-detail.component.html',
})
export class CourseDetailComponent implements OnInit {
  private courseService = inject(CourseService);

  // 🔴 MODERN ANGULAR SIGNAL INPUT: Automatically extracts the ":id" route parameter from the URL mapping template
  public id = input.required<number>();

  // Reactive state management placeholders
  public course = signal<CourseDetailsDto | null>(null);
  public errorMessage = signal<string | null>(null);
  public successMessage = signal<string | null>(null);

  ngOnInit(): void {
    // Read the signal input id directly to execute a clean fetch action
    this.courseService.getCourseById(this.id()).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.course.set(res.data);
        } else {
          this.errorMessage.set(res.errors.join(', '));
        }
      },
      error: () =>
        this.errorMessage.set(
          'Failed to pull the specified course from server registries.',
        ),
    });
  }

  public onEnrollClick(): void {
    const activeCourse = this.course();
    if (!activeCourse) return;

    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.courseService.enrollStudent(activeCourse.id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.successMessage.set('Successfully enrolled in this course!');
          // Sync state array update parameters locally
          this.course.update((current) =>
            current
              ? { ...current, currentEnrolled: current.currentEnrolled + 1 }
              : null,
          );
        }
      },
      error: (err) => {
        this.errorMessage.set(
          err.error?.errors?.join(', ') || 'Enrollment transaction aborted.',
        );
      },
    });
  }
}
