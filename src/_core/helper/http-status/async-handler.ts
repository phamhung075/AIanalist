import { NextFunction, RequestHandler, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { CustomRequest } from '../../guard/handle-permission/user-context.interface';
import { RestHandler } from './common/RestHandler';

// Middleware function to log responses and errors
export function logResponseMiddleware(
    fn: (req: CustomRequest, res: Response, next: NextFunction) => Promise<any>
) {
    return async (req: CustomRequest, res: Response, next: NextFunction) => {
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


export type AsyncHandlerFn = (handler: RequestHandler) => 
    (req: CustomRequest, res: Response, next: NextFunction) => Promise<any>;

export const asyncHandlerFn: AsyncHandlerFn = (handler: RequestHandler) =>
    logResponseMiddleware(async (
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ) => {
        const startTime = Date.now();
        if (!req.startTime) 
            req.startTime = startTime;       
        
        try {
            const result = await handler(req, res, next);          
            
            if (!res.headersSent) {
                const baseUrl = `${req.protocol}://${req.get('host')}`;
                const resourceUrl = `${baseUrl}${req.originalUrl}`;
                
                return RestHandler.success(req, res, {
                    code: res.statusCode,
                    data: result === undefined ? {} : result,
                    startTime: req.startTime,
                    links: {
                        self: resourceUrl
                    }
                });
            }
            return result;
            
        } catch (error: unknown) {
            const logDir = createLogDir();
            const logger = createLogger(logDir);
            logger.logError(createErrorLog(req, error, startTime));
            
            handleError(req, res, error);
            return next(error);
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
function createErrorLog(req: CustomRequest, error: any, startTime: number): string {
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
function handleError(req: CustomRequest, res: Response, error: any) {    
    return RestHandler.error(req, res, {
                code: error.status,
                message: error.message,
                errors: error.errors?.map((error: any) => ({
                    code: error.code || 'UNKNOWN_ERROR',
                    message: error.message,
                    field: error.field,
                })),
            });
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