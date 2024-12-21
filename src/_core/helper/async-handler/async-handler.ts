import * as fs from 'fs';
import * as path from 'path';
import { NextFunction, Response } from 'express';
import { ErrorResponse } from './error/error.response';
import { HttpStatusCode } from './common/httpStatusCode';
import { ExtendedFunctionRequest } from '../../guard/handle-permission/user-context.interface';
import { RestHandler } from './common/response.handler';
const { StatusCodes } = HttpStatusCode;

// Middleware function to log responses and errors
export function logResponseMiddleware(
    fn: (req: ExtendedFunctionRequest, res: Response, next: NextFunction) => Promise<any>
) {
    return async (req: ExtendedFunctionRequest, res: Response, next: NextFunction) => {
        const startTime = Date.now();
        const logDir = createLogDir();
        const logger = createLogger(logDir);

        try {
            await fn(req, res, next);
        } catch (error: any) {
            logger.logError(createErrorLog(req, error, startTime));
            handleError(req, res, error);
            next(error);
        }
    };
}

// Async handler function
export const asyncHandlerFn = (
    fn: (req: ExtendedFunctionRequest, res: Response, next: NextFunction) => Promise<any>
) => logResponseMiddleware(async (req: ExtendedFunctionRequest, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    try {
        const result = await fn(req, res, next);

        if (!res.headersSent) {
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const resourceUrl = `${baseUrl}${req.originalUrl}`;

            return RestHandler.success(res, {
                data: result,
                meta: {
                    processTime: `${Date.now() - startTime}ms`
                },
                links: {
                    self: resourceUrl,
                    // Add other HATEOAS links as needed
                }
            });
        }
    } catch (error: any) {
        const logDir = createLogDir();
        const logger = createLogger(logDir);
        logger.logError(createErrorLog(req, error, startTime));
        
        handleError(req, res, error);
        next(error);
    }
});

// Logger utility
function createLogger(logDir: string) {
    return {
        logError: (message: string) => {
            fs.appendFileSync(path.join(logDir, 'error-log.txt'), message + '\n', 'utf8');
        },
        logResponse: (message: string) => {
            fs.appendFileSync(path.join(logDir, 'response-log.txt'), message + '\n', 'utf8');
        }
    };
}

// Error logging format
function createErrorLog(req: ExtendedFunctionRequest, error: any, startTime: number): string {
    return `
${new Date().toISOString()}
_________________ ERROR _________________
Request: ${req.method} ${req.originalUrl}
Duration: ${Date.now() - startTime}ms
Error: ${error instanceof Error ? error.message : String(error)}
Stack: ${error instanceof Error ? error.stack : 'No stack trace available'}
__________________________________________
    `;
}

// Error handler
function handleError(_req: ExtendedFunctionRequest, res: Response, error: any) {
    if (!res.headersSent) {
        if (error instanceof ErrorResponse) {
            return RestHandler.error(res, {
                code: error.status,
                message: error.message,
                errors: [{
                    code: error.constructor.name.replace('Error', '').toUpperCase(),
                    message: error.message
                }]
            });
        }

        // Handle unexpected errors
        return RestHandler.error(res, {
            code: StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'An unexpected error occurred',
            errors: [{
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Unknown error'
            }]
        });
    }
}

// Create log directory
function createLogDir(): string {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const hour = now.getUTCHours().toString().padStart(2, '0');
    const logDir = path.join(__dirname, '../../../../logs', 'api', date, hour);

    fs.mkdirSync(logDir, { recursive: true });
    return logDir;
}