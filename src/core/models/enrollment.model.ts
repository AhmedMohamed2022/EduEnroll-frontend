// Path: src/app/core/models/enrollment.model.ts
export interface EnrollStudentDto {
  studentId: number;
  courseId: number;
}

export interface EnrollmentDetailsDto {
  id: number;
  studentId: number;
  courseId: number;
  status: string;
  enrolledAt: string;
}
