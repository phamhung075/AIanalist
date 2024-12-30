import * as fs from 'fs';
import * as path from 'path';
import { config } from '../../config/dotenv.config';
import { getRequest } from '@/_core/middleware/displayRequest.middleware';
import { CustomRequest } from '../interfaces/CustomRequest.interface';
// const appDir = path.dirname(require.main?.filename || '');
const logDirRoot = config.logDir;


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