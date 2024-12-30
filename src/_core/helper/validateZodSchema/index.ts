import { ZodSchema, ZodError } from 'zod';
import { Request } from 'express';
import { HttpStatusCode } from '@/_core/helper/http-status/common/HttpStatusCode';
import { ErrorResponse } from '@/_core/helper/http-status/error';

// Define supported validation types
type ValidationType = 'body' | 'params' | 'query';

/**
 * Validates incoming request data based on the specified schema and type.
 * @param schema ZodSchema for validation
 * @param type 'body' | 'params' | 'query'
 */
export const validateSchema = (schema: ZodSchema, type: ValidationType = 'body') => {
  return (req: Request) => {
    try {
      const dataToValidate = {
        body: req.body,
        params: req.params,
        query: req.query,
      }[type]; // Dynamically pick the validation target

      schema.parse(dataToValidate); // Validate against the schema
    } catch (err) {
      if (err instanceof ZodError) {
        throw new ErrorResponse({
          status: HttpStatusCode.BAD_REQUEST,
          message: 'Validation Error',
          errors: err.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        });
      }
      throw err;
    }
  };
};
