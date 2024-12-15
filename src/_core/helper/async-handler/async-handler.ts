import * as fs from 'fs';
import * as path from 'path';
import { NextFunction, Response } from 'express';
import { ErrorResponse } from './error/error.response';
import { HttpStatusCode } from './common/httpStatusCode';
import { ExtendedFunctionRequest } from '../../guard/handle-permission/user-context.interface';
const { StatusCodes, ReasonPhrases } = HttpStatusCode;

// Middleware function to log responses and errors
export function logResponseMiddleware(
	fn: (req: ExtendedFunctionRequest, res: Response, next: NextFunction) => Promise<any>
) {
	return async (req: ExtendedFunctionRequest, res: Response, next: NextFunction) => {
		const oldJson = res.json.bind(res); // Save the original res.json method
		const logDir = createLogDir(); // Create log directory

		// Helper function to log messages to a file
		const logMessage = (message: string, fileName: string = 'error-log.txt') => {
			try {
				fs.appendFileSync(path.join(logDir, fileName), message + '\n', 'utf8');
			} catch (err) {
				console.error('Error writing to log file:', err);
			}
		};

		// Override res.json to log responses and errors
		res.json = function (data: any) {
			logResponse(req, res, data, logMessage);
			return oldJson(data);
		};

		try {
			await fn(req, res, next); // Execute the original function
		} catch (error: any) {
			handleError(req, res, error, logMessage);
			next(error);
		}
	};
}

// Async handler function that logs responses and errors
export const asyncHandlerFn = (
	fn: (req: ExtendedFunctionRequest, res: Response, next: NextFunction) => Promise<any>
) => logResponseMiddleware(async (req: ExtendedFunctionRequest, res: Response, next: NextFunction) => {
	try {
		const result = await fn(req, res, next); // Execute route handler

		// Send the response if it hasn't been sent yet
		if (!res.headersSent) {
			res.json({ result });
		}
	} catch (error: any) {
		const logDir = createLogDir();

		// Re-declare logMessage inside asyncHandlerFn
		const logMessage = (message: string) => {
			try {
				fs.appendFileSync(path.join(logDir, 'error-log.txt'), message + '\n', 'utf8');
			} catch (err) {
				console.error('Error writing to log file:', err);
			}
		};

		handleError(req, res, error, logMessage);
		next(error);
	}
});

// Function to log responses and errors
function logResponse(req: ExtendedFunctionRequest, res: Response, data: any, logMessage: (msg: string) => void) {
	console.log("\n\n_________________ RESULT _________________");
	console.log(`API Response for ${req.method} ${req.originalUrl}:`);
	console.log(`Status Code: ${res.statusCode}`);
	console.log("Response Body:", JSON.stringify(data, null, 2));
	console.log("__________________________________________\n\n");

	if (res.statusCode >= 400) {
		const errorMessage = `
${new Date().toISOString()}
_________________ ERROR _________________
Error during ${req.method} ${req.originalUrl}:
Status Code: ${res.statusCode}
Response Body: ${JSON.stringify(data, null, 2)}
__________________________________________\n\n`;

		logMessage(errorMessage);
	}
}

// Function to handle and log errors
function handleError(req: ExtendedFunctionRequest, res: Response, error: any, logMessage: (msg: string) => void) {
	const errorMessage = `
${new Date().toISOString()}
_________________ ERRORstack _________________
Error during ${req.method} ${req.originalUrl}:
Error: ${error instanceof Error ? error.message : String(error)}
Stack Trace: ${error instanceof Error ? error.stack : 'No stack trace available'}
__________________________________________\n\n`;

	logMessage(errorMessage);

	if (!res.headersSent) {
		const { status, message } = getErrorResponse(error);
		res.status(status).json({
			error: true,
			code: status,
			message
		});
	}
}

// Get proper status and message for error response
function getErrorResponse(error: any) {
	let status = StatusCodes.INTERNAL_SERVER_ERROR;
	let message = ReasonPhrases.INTERNAL_SERVER_ERROR;

	if (error instanceof ErrorResponse) {
		status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
		const statusCodeKey = Object.keys(StatusCodes).find(
			(key) => StatusCodes[key as keyof typeof StatusCodes] === status
		);
		message = `${ReasonPhrases[statusCodeKey as keyof typeof ReasonPhrases]}${error.message ? ", " + error.message : ""}`;
	} else if (typeof error.status === 'number') {
		const statusCodeKey = Object.keys(StatusCodes).find(
			(key) => StatusCodes[key as keyof typeof StatusCodes] === error.status
		);
		if (statusCodeKey) {
			status = error.status;
			message = ReasonPhrases[statusCodeKey as keyof typeof ReasonPhrases];
		}
	}
	return { status, message };
}

// Create the log directory based on the current UTC date and hour
function createLogDir(): string {
	const now = new Date();
	const date = now.toISOString().split('T')[0]; // Date in UTC
	const hour = now.getUTCHours().toString().padStart(2, '0'); // Hour in UTC
	const logDir = path.join(__dirname, '../../../../logs', 'error', date, hour);

	fs.mkdirSync(logDir, { recursive: true }); // Create the directory if it doesn't exist
	return logDir;
}