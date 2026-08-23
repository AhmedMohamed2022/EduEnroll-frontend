// Path: src/app/core/models/course.model.ts
export interface CourseCreateDto {
  title: string;
  description: string;
  capacity: number;
  price: number;
}

export interface CourseDetailsDto {
  id: number;
  title: string;
  description: string;
  capacity: number;
  currentEnrolled: number;
  price: number;
  createdAt: string;
}
