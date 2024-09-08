import path = require("path");
import fs = require("fs");

export class SimpleLogger {
    private logFile: string;

    constructor() {
        const logDir = path.join(__dirname, '../../../logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
        this.logFile = path.join(logDir, `app-${new Date().toISOString().split('T')[0]}.log`);
    }

    private log(level: string, message: string, meta?: any): void {
        const timestamp = new Date().toISOString();
        const logMessage = `${timestamp} [${level}] ${message} ${meta ? JSON.stringify(meta) : ''}
`;
        console.log(logMessage.trim());
        fs.appendFileSync(this.logFile, logMessage);
    }

    info(message: string, meta?: any): void {
        this.log('INFO', message, meta);
    }

    error(message: string, error: Error): void {
        this.log('ERROR', message, { error: error.stack });
    }

    warn(message: string, meta?: any): void {
        this.log('WARN', message, meta);
    }

    debug(message: string, meta?: any): void {
        this.log('DEBUG', message, meta);
    }
}
