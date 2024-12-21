// src/_core/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { HttpStatusCode } from '../helper/async-handler/common/httpStatusCode';
import { ErrorResponse } from '../helper/async-handler/error/error.response';
import { RestHandler } from '../helper/async-handler/response.handler';


const { StatusCodes } = HttpStatusCode;

export function errorMiddleware(
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    // Log error
    console.error('Error:', {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
    });

    // Handle different types of errors
    if (error instanceof ErrorResponse) {
        return RestHandler.error(res, {
            code: error.status,
            message: error.message,
            errors: [
                {
                    code: error.code,
                    message: error.message,
                    ...(error.field && { field: error.field }),
                    ...(error.details && { details: error.details })
                },
                ...(error.errors || [])
            ]
        });
    }

    // Handle validation errors
    if (error.name === 'ValidationError' && 'errors' in error) {
        const validationError = error as any;
        return RestHandler.error(res, {
            code: StatusCodes.UNPROCESSABLE_ENTITY,
            message: 'Validation failed',
            errors: validationError.errors?.map((err: any) => ({
                code: 'VALIDATION_ERROR',
                message: err.message,
                field: err.path
            })) || []
        });
    }

    // Handle unexpected errors
    return RestHandler.error(res, {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
        errors: [{
            code: 'INTERNAL_SERVER_ERROR',
            message: error.message || 'An unexpected error occurred'
        }]
    });
}