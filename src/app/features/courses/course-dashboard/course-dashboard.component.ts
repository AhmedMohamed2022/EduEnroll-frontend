// Path: src/app/features/courses/course-dashboard.component.ts
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
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

  // Expose the read-only signal straight to the HTML engine template
  public coursesList = this.courseService.courses;

  // Local component interactive form state models
  public newCourse: CourseCreateDto = {
    title: '',
    description: '',
    capacity: 20,
    price: 0,
  };
  public errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.courseService.loadCourses().subscribe({
      error: () => this.errorMessage.set('Failed to pull server registries.'),
    });
  }

  public onFormSubmit(): void {
    this.errorMessage.set(null);
    this.courseService.createCourse(this.newCourse).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          // Wipe form inputs safely
          this.newCourse = {
            title: '',
            description: '',
            capacity: 20,
            price: 0,
          };
        } else {
          this.errorMessage.set(res.errors[0]);
        }
      },
      error: () =>
        this.errorMessage.set('An error occurred during submission.'),
    });
  }
}
