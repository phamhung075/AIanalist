// import { NextFunction } from "@node_modules/@types/express";
// import { StatusCodes } from "../helper/async-handler/common/statusCodes";
// import { RestHandler } from "../helper/async-handler/response.handler";
// import { ApiError } from "../types/response.types";
// import { ErrorResponse } from "../helper/async-handler/error/error.response";
// import { Response } from 'express';

// export function errorMiddleware(
//     error: Error,
//     _req: Request,
//     res: Response,
//     _next: NextFunction
// ) {
//     // Log error
//     console.error('Error:', {
//         message: error.message,
//         stack: error.stack,
//         timestamp: new Date().toISOString()
//     });

//     // Handle ErrorResponse instances
//     if (error instanceof ErrorResponse) {
//         const apiErrors: ApiError[] = error.errors?.map(err => ({
//             code: err.code || 'UNKNOWN_ERROR',
//             message: err.message,
//             field: err.field,
//             details: err.details
//         })) || [{
//             code: error.code || 'UNKNOWN_ERROR',
//             message: error.message,
//             field: error.field
//         }];

//         return RestHandler.error(res, {
//             code: error.status,
//             message: error.message,
//             errors: apiErrors
//         });
//     }

//     // Handle validation errors
//     if (error.name === 'ValidationError' && 'errors' in error) {
//         const validationError = error as any;
        
//         const apiErrors: ApiError[] = validationError.errors?.map((err: any) => ({
//             code: 'VALIDATION_ERROR',
//             message: err.message,
//             field: err.path,
//             details: err.value
//         })) || [];

//         return RestHandler.error(res, {
//             code: StatusCodes.UNPROCESSABLE_ENTITY,
//             message: 'Validation failed',
//             errors: apiErrors
//         });
//     }

//     // Handle unexpected errors
//     console.error('Unexpected error:', error);
//     return RestHandler.error(res, {
//         code: StatusCodes.INTERNAL_SERVER_ERROR,
//         message: 'Internal Server Error',
//         errors: [{
//             code: 'INTERNAL_SERVER_ERROR',
//             message: error.message || 'An unexpected error occurred',
//             details: process.env.NODE_ENV === 'development' ? error.stack : undefined
//         }]
//     });
// }