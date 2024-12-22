import { config } from '@/_core/config/dotenv.config';
//console.log(`Loaded environment: ${env}`);

export class InfoService {

	/**
	 * Returns server information as a human-readable string
	 * @returns Server information
	 */
	async fetchDisplayableServerInfo(): Promise<string> {
		let msg: string[] = [];
		const mode = config.mode;
		const appName = config.appName;
		const appVersion = config.appVersion;
		const dbUri = config.dbUri;
		const serverType = dbUri.substr(0, dbUri.indexOf(':'));

		if (mode === 'development') {
			const devHost = config.host || 'localhost';
			const devPort = config.port || '3000';
			msg = [
				`Le serveur ${appName} v${appVersion} tourne en mode '${mode}' sur http://${devHost}:${devPort}.`,
			];
			msg.push(`Le serveur ${serverType} est : ${dbUri}.`);
		} else {
			const prodHost = config.host || 'localhost';
			const prodPort = config.port || '443';

			msg = [
				`Le serveur ${appName} v${appVersion} tourne en mode '${mode}' sur https://${prodHost}:${prodPort}.`,
			];
			msg.push(`Le serveur ${serverType} est : ${dbUri}.`);
		}
		return msg.join(`\r\n`);
	}
}



