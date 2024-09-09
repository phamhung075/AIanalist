import dotenv from 'dotenv';
import path from 'path';
// Determine the environment and load the corresponding .env file
const env = process.env.NODE_ENV || 'development';
const envFile = path.resolve(__dirname, `../environment/.env.${env}`);

dotenv.config({ path: envFile });

//console.log(`Loaded environment: ${env}`);

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
			const devHost = process.env.HOST || 'localhost';
			const devPort = process.env.PORT || '3000';

			msg = [
				`Le serveur ${appName} v${appVersion} tourne en mode '${mode}' sur http://${devHost}:${devPort}.`,
			];
			msg.push(`Le serveur ${serverType} est : ${dbUri}.`);
		} else {
			const prodHost = process.env.HOST || 'localhost';
			const prodPort = process.env.PORT || '443';

			msg = [
				`Le serveur ${appName} v${appVersion} tourne en mode '${mode}' sur https://${prodHost}:${prodPort}.`,
			];
			msg.push(`Le serveur ${serverType} est : ${dbUri}.`);
		}
		return msg.join(`\r\n`);
	}
}



