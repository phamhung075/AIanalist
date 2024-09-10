import { Response, NextFunction } from 'express';
import * as fs from "fs";
import * as path from "path";
import { ExtendedFunctionRequest } from '../../guard/handle-permission/user-context.interface';

import { HttpStatusCode } from "./../../helper/async-handler/common/httpStatusCode"
const { StatusCodes, ReasonPhrases } = HttpStatusCode
// Middleware function to log responses
export function logResponseMiddleware(fn: (req: ExtendedFunctionRequest, res: Response, next: NextFunction) => Promise<any>) {
	return async (req: ExtendedFunctionRequest, res: Response, next: NextFunction) => {

		// Save the original res.json method
		const oldJson = res.json.bind(res);

		// Create log directory
		const logDir = createLogDir();

		// Helper function to log errors to a file
		const logError = (message: string) => {
			fs.appendFileSync(path.join(logDir, 'error-log.txt'), message + '\n', 'utf8');
		};

		// Override res.json to log the response and forward it correctly
		res.json = function (data: any) {
			console.log("\n\n_________________ RESULT _________________");
			console.log(`API Response for ${req.method} ${req.originalUrl}:`);
			console.log(`Status Code: ${res.statusCode} - ${res.statusCode}`);
			console.log("Response Body:", JSON.stringify(data, null, 2));
			console.log("__________________________________________\n\n");

			// If there's an error (status code >= 400), log it
			if (res.statusCode >= 400) {
				console.log('write error to folder '+path.join(logDir, 'error-log.txt'));

				const requestBody = req.body && typeof req.body === 'object' ? JSON.stringify(req.body, null, 2) : req.body;
				const errorMessage = `
${new Date().toISOString()}
_________________ ERROR _________________
Error occurred during ${req.method} ${req.originalUrl}:
Request URL: ${req.originalUrl}
Request body: 
${requestBody}

Status Code: ${res.statusCode}
Response Body: 
${JSON.stringify(data, null, 2)}
__________________________________________\n\n`;

				// Log the error to a file
				logError(errorMessage);
				
			}

			// Call the original res.json method to send the response to the client
			return oldJson(data);  // Ensure the response is forwarded correctly
		};

		try {
			// Execute the original function (route handler or other middleware)
			await fn(req, res, next);
		} catch (error) {
			// If an error occurs, call next with the error to handle it
			next(error);
		}
	};
}

/**
 * Create the log directory based on current date and hour
 */

export function createLogDir(): string {
	const now = new Date();

	// Get the date and time components in UTC
	const date = now.toISOString().split('T')[0]; // This already returns the date in UTC
	const hour = now.getUTCHours().toString().padStart(2, '0'); // Get the hours in UTC

	// Construct the log directory path using the UTC date and hour
	const logDir = path.join(__dirname, '../../../../logs', 'error', date, hour);

	// Create the directory if it doesn't exist
	fs.mkdirSync(logDir, { recursive: true });

	return logDir;
}
