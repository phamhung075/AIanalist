import { configService } from "../server/config";
import * as fs from "fs";
import path = require('path');

/**
 * Service permettant de récupérer des informations sur le serveur
 */
export class InfoService {

	/**
	 * Retourne les informations du serveur sous forme de chaîne humainement lisible
	 * @returns Informations du serveur
	 */
	async fetchDisplayableServerInfo(): Promise<string> {
		let msg: string[] = [];
		if (configService.getEnvProperty('main.mode') === 'dev') {
			msg = [
				`Le serveur ${configService.getEnvProperty('parse.app_name')} v${configService.getEnvProperty('main.app_version')}` +
				` tourne en mode "${configService.getEnvProperty('main.mode')}" sur http://${configService.getEnvProperty('dev.parse_host')}:${configService.getEnvProperty('dev.parse_port')}.`
			];
			const serverType = configService.getEnvProperty('database.uri').substr(0, configService.getEnvProperty('database.uri').indexOf(':'));
			msg.push(`Le serveur ${serverType} est : ${configService.getEnvProperty('database.uri')}.`);
		} else {
			msg = [
				`Le serveur ${configService.getEnvProperty('parse.app_name')} v${configService.getEnvProperty('main.app_version')}` +
				` tourne en mode "${configService.getEnvProperty('main.mode')}" sur https://${configService.getEnvProperty('parse.host')}:${configService.getEnvProperty('parse.port')}.`
			];
			const serverType = configService.getEnvProperty('database.uri').substr(0, configService.getEnvProperty('database.uri').indexOf(':'));
			msg.push(`Le serveur ${serverType} est : ${configService.getEnvProperty('database.uri')}.`);
		}
		return msg.join('\r\n');
	}
}

export const logResponseMiddleware = (req: any, res: any, next: any) => {
	const oldJson = res.json;

	// Get the current date and time
	const now = new Date();
	const date = now.toISOString().split('T')[0]; // e.g., '2024-09-06'
	const hour = now.getHours(); // e.g., 0, 1, ..., 23

	// Define log directory structure for errors
	const logDir = path.join(__dirname, '../../../../logs', 'error', date!, hour.toString());
	const errorLogFilePath = path.join(logDir, 'error-log.txt');

	// Ensure the log directory exists
	fs.mkdirSync(logDir, { recursive: true });

	// Helper function to log errors to a file
	const logError = (message: string) => {
		fs.appendFileSync(errorLogFilePath, message + '\n', 'utf8');
	};

	res.status = function (code: number) {
		res.statusCode = code;
		return res;
	}

	res.json = function (data: any) {
		// Log response to the console as before
		console.warn("\n\n_________________ RESULT _________________");
		console.log(`API Response for ${req.method} ${req.originalUrl}:`);
		console.log(`Request URL: ${req.originalUrl}`);
		console.log(`Status Code: ${res.statusCode}`);
		console.log("Response Body:", JSON.stringify(data, null, 2));
		console.warn("___________________________________________________\n\n");

		// If an error occurred (status code >= 400), log it to the file
		if (res.statusCode >= 400) {
			// Ensure the request body is a valid object before logging it
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
___________________________________________________\n\n`;

			// Log the error to a file
			logError(errorMessage);
		}

		oldJson.apply(res, arguments);
	};

	next();
};

