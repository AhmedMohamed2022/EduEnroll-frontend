// Path: src/app/core/models/api-response.model.ts
export interface GeneralApiResponse<T> {
  isSuccess: boolean;
  statusCode: number;
  data: T;
  errors: string[];
}
