import { ZodError } from 'zod';

interface ValidationError {
  path: string;
  message: string;
}

interface ValidationErrorResponse {
  result: number;
  message: string;
  data: ValidationError[];
}

export const handleZodError = (error: ZodError): ValidationErrorResponse => {
  const errors: ValidationError[] = error.errors.map(e => {
    return {
      path: e.path[e.path.length - 1].toString(),
      message: e.message,
    };
  });

  return {
    result: 0,
    message: 'Validation Error',
    data: errors,
  };
};