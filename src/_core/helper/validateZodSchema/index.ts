import { ZodSchema, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { HttpStatusCode } from '@/_core/helper/http-status/common/HttpStatusCode';
import { ErrorResponse } from '@/_core/helper/http-status/error';

/**
 * Middleware for validating request data with Zod schema
 * @param schema ZodSchema for validation
 * @param type 'body' | 'params' | 'query'
 */
export function validateDTO(schema: ZodSchema, type: 'body' | 'params' | 'query' = 'body') {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const dataToValidate = {
                body: req.body,
                params: req.params,
                query: req.query,
            }[type]; // Dynamically pick the validation target

            schema.parse(dataToValidate); // Validate the selected data

            next(); // Proceed to the next middleware/controller if valid
        } catch (err) {
            if (err instanceof ZodError) {
                return res.status(HttpStatusCode.BAD_REQUEST).json(
                    new ErrorResponse({
                        status: HttpStatusCode.BAD_REQUEST,
                        message: 'Validation Error',
                        errors: err.issues.map((issue) => ({
                            field: issue.path.join('.'),
                            message: issue.message,
                        })),
                    })
                );
            }
            next(err); // Pass unexpected errors to the error handler
        }
    };
}
