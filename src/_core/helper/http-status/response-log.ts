import * as fs from 'fs';
import * as path from 'path';
import { config } from '../../config/dotenv.config';
import { getRequest } from '@/_core/middleware/displayRequest.middleware';
import { CustomRequest } from '../interfaces/CustomRequest.interface';
// const appDir = path.dirname(require.main?.filename || '');
const logDirRoot = config.logDir;
// import { RestHandler } from './common/RestHandler';

// Middleware function to log responses and errors
// export function logResponseMiddleware(
//     fn: (req: CustomRequest, res: Response, next: NextFunction) => Promise<any>
// ) {
//     return async (req: CustomRequest, res: Response, next: NextFunction) => {
//         const startTime = Date.now();
//         const logDir = createLogDir();
//         const logger = createLogger(logDir);

//         try {
//             await fn(req, res, next);
//         } catch (error: any) {
//             logger.logError(createErrorLog(req, error, startTime));
//             handleError(req, res, error);
//             next(error);
//         }
//     };
// }



export function createLogger(logDir: string) {
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
export function createErrorLog(req: CustomRequest, error: any, startTime: number): string {
    const requestLog = getRequest(req);
    return `
_________________ REQUEST _________________
Request: ${req.method} ${req.originalUrl}
Duration: ${Date.now() - startTime}ms
${requestLog}
_________________ ERROR _________________
Error: ${error instanceof Error ? error.message : String(error)}
Stack: ${error instanceof Error ? error.stack : 'No stack trace available'}
__________________________________________
    `;
}

// // Error handler
// function handleError(req: CustomRequest, res: Response, error: any) {    
//     return RestHandler.error(req, res, {
//                 code: error.status,
//                 message: error.message,
//                 errors: error.errors?.map((error: any) => ({
//                     code: error.code || 'UNKNOWN_ERROR',
//                     message: error.message,
//                     field: error.field,
//                 })),
//             });
// }
// Create log directory
export function createLogDir(): string {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const hour = now.getUTCHours().toString().padStart(2, '0');
    const logDir = path.join(logDirRoot, 'error', date, hour);
    fs.mkdirSync(logDir, { recursive: true });
    return logDir;
}

export function logResponse(req: CustomRequest, response: string) {
    const logDir = createLogDir();
    const logger = createLogger(logDir);
    console.log("response saved on:", logDir);
    logger.logError(createErrorLog(req, response, req.startTime || 0));
}