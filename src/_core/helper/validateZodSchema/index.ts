import { Request } from 'express';
import { ZodError, ZodSchema } from 'zod';
import _ERROR, { ErrorResponse } from '../http-status/error';
import { HttpStatusCode } from '../http-status/common/HttpStatusCode';

// Assuming validateSchema is synchronous
export const validateSchema = (schema: ZodSchema) => {
  return (req: Request) => {
    try {
      schema.parse(req.body);
    } catch (err) {
      if (err instanceof ZodError) {
        throw new ErrorResponse({
          status: HttpStatusCode.BAD_REQUEST,
          message: 'Validation Error',
          errors: err.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          }))
        });
      }
      throw err;
    }
  };
};