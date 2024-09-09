import * as fs from "fs";
import path = require('path');

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export class InfoService {

	/**
	 * Returns server information as a human-readable string
	 * @returns Server information
	 */
	async fetchDisplayableServerInfo(): Promise<string> {
		let msg: string[] = [];
		const mode = process.env.NODE_ENV || 'production';
		const appName = process.env.PARSE_APP_NAME || 'Unknown App';
		const appVersion = process.env.APP_VERSION || '1.0.0';
		const dbUri = process.env.DATABASE_URI || '';
		const serverType = dbUri.substr(0, dbUri.indexOf(':'));

		if (mode === 'development') {
			const devHost = process.env.DEV_PARSE_HOST || 'localhost';
			const devPort = process.env.DEV_PARSE_PORT || '3000';

			msg = [
				`Le serveur ${appName} v${appVersion} tourne en mode "${mode}" sur http://${devHost}:${devPort}.`,
			];
			msg.push(`Le serveur ${serverType} est : ${dbUri}.`);
		} else {
			const prodHost = process.env.PARSE_HOST || 'localhost';
			const prodPort = process.env.PARSE_PORT || '443';

			msg = [
				`Le serveur ${appName} v${appVersion} tourne en mode "${mode}" sur https://${prodHost}:${prodPort}.`,
			];
			msg.push(`Le serveur ${serverType} est : ${dbUri}.`);
		}
		return msg.join('\r\n');
	}
}



export const logResponseMiddleware = (req: any, res: any, next: any) => {
	console.log('logResponseMiddleware - Middleware has been hit');

	// Log request details
	console.log(`Method: ${req.method}`);
	console.log(`URL: ${req.originalUrl}`);
	console.log(`Headers: ${JSON.stringify(req.headers, null, 2)}`);
	console.log(`Body: ${JSON.stringify(req.body, null, 2)}`);

	// Save the original res.json method
	const oldJson = res.json.bind(res);

	// Get the current date and time for logging
	const now = new Date();
	const date = now.toISOString().split('T')[0];
	const hour = now.getHours().toString();

	// Define log directory and error log file path
	const logDir = path.join(__dirname, '../../../../logs', 'error', date, hour);
	const errorLogFilePath = path.join(logDir, 'error-log.txt');

	// Ensure the log directory exists
	fs.mkdirSync(logDir, { recursive: true });

	const logError = (message: string) => {
		fs.appendFileSync(errorLogFilePath, message + '\n', 'utf8');
	};

	// Override res.json to log the response and forward it correctly
	res.json = function (data: any) {
		console.log("\n\n_________________ RESULT _________________");
		console.log(`API Response for ${req.method} ${req.originalUrl}:`);
		console.log(`Status Code: ${res.statusCode}`);
		console.log("Response Body:", JSON.stringify(data, null, 2));
		console.log("__________________________________________\n\n");

		// If there's an error (status code >= 400), log it
		if (res.statusCode >= 400) {
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

	next();  // Call the next middleware or route handler
};
