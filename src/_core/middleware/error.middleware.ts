import { Response } from 'express';
import { HttpStatusCode } from './common/httpStatusCode';

const { StatusCodes, ReasonPhrases } = HttpStatusCode;

export function errorMiddleware(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
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
            errors: [{
                code: error.code,
                message: error.message,
                field: error.field,
                details: error.details
            }]
        });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
        return RestHandler.error(res, {
            code: StatusCodes.UNPROCESSABLE_ENTITY,
            message: 'Validation failed',
            errors: error.errors?.map(err => ({
                code: 'VALIDATION_ERROR',
                message: err.message,
                field: err.path
            }))
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