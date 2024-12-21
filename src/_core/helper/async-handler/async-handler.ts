import { NextFunction, RequestHandler, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { ExtendedFunctionRequest } from '../../guard/handle-permission/user-context.interface';
import { HttpStatusCode } from './common/httpStatusCode';
import { RestHandler } from './common/response.handler';
import { ErrorResponse } from './error/error.response';
import { AsyncHandlerFn } from '../register-routes/RegisterRoutes';
import { yellow } from 'colorette';
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

export const asyncHandlerFn: AsyncHandlerFn = (handler: RequestHandler) => 
    logResponseMiddleware(async (
        req: ExtendedFunctionRequest, 
        res: Response, 
        next: NextFunction
    ) => {
        const startTime = Date.now();

        try {
            const result = await handler(req, res, next);

            if (!res.headersSent) {
                const baseUrl = `${req.protocol}://${req.get('host')}`;
                const resourceUrl = `${baseUrl}${req.originalUrl}`;
                console.log(yellow(`Response sent for ${resourceUrl}`));
                return RestHandler.success(res, {
                    data: result,             
                    links: {
                        self: resourceUrl,
                    }
                });
            }
        } catch (error: any) {
            console.log(yellow("Error in asyncHandlerFn:"));
            const logDir = createLogDir();
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const logger = createLogger(logDir, baseUrl);
            logger.logError(createErrorLog(req, error, startTime));
            
            handleError(req, res, error);
            next(error);
        }
    });

// Logger utility
function createLogger(logDir: string, api: string) {
    return {
        logError: (message: string) => {
            fs.appendFileSync(path.join(logDir, "error" ,api, '.txt'), message + '\n', 'utf8');
        },
        logResponse: (message: string) => {
            fs.appendFileSync(path.join(logDir, "success",api, '.txt'), message + '\n', 'utf8');
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
                errors: error.errors?.map(err => ({
                    code: err.code || 'UNKNOWN_ERROR',
                    message: err.message,
                    field: err.field,
                }))
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
    const logDir = path.join(__dirname, '../../../../logs', 'error', date, hour);

    fs.mkdirSync(logDir, { recursive: true });
    return logDir;
}