import { RouteDisplay } from '@/_core/helper/route-display/route-display.index';
import cors from 'cors'; // Correct way to import
import express from 'express';
import * as fs from "fs";
import * as http from "http";
import * as https from "https";
import { isEmpty } from 'lodash';
import * as path from "path";
import { checkSystemOverload } from '../../helper/check-system-overload/check-system-overload';
import { SimpleLogger } from '../../logger/simple-logger'; // Assuming SimpleLogger is used for logging
// Determine the environment and load the corresponding .env file
import { config, showConfig } from '@/_core/config/dotenv.config';
import { isRunningWithNodemon } from '@src/_core/helper/check-nodemon';
import { bgMagenta, bgWhite, blue, blueBright, cyan, green, greenBright, yellow } from 'colorette';
import { modules } from '@/modules';
// import { testFirestoreAccess } from '@/_core/database/firebase';


const env = config.env;
const pathToEnvFile = path.resolve(__dirname, `../../../../environment/.env.${env}`);
const envFile = path.resolve(pathToEnvFile);

isRunningWithNodemon()

// Load environment variables from the .env file
console.log(green(`Loading environment from  ${blue(envFile)}`));
console.log(
	green(`All environment variables are ${yellow(process.env.TEST_VAR || 'N/A')} on mode ${yellow(process.env.NODE_ENV || 'N/A')}`)
);

console.log(showConfig());

/**
 * Service class for managing the server application
 */
export class AppService {
	private static instance: AppService;
	readonly app = express();
	private logger: SimpleLogger = new SimpleLogger();
	private port: number | string = process.env.PORT || 3000;

	constructor() {
		if (AppService.instance) {
			return AppService.instance;
		}
		this.logger = new SimpleLogger();
		AppService.instance = this;
	}

	public static getInstance(): AppService {
		if (!AppService.instance) {
			new AppService();
		}
		return AppService.instance;
	}

	/**
	 * Initialize middleware and settings
	 */
	private async init(): Promise<void> {
		this.setupCors();
		this.app.use(express.json({ limit: '50mb' }));
		this.app.use(express.urlencoded({ limit: '50mb', extended: true }));
		this.app.use(this.showRequestUrl);
	}

	/**
	 * Setup CORS based on environment
	 */
	private setupCors(): void {
		const devOrigin = ['http://localhost:3333'];
		const prodOrigin = ['http://localhost:3333'];

		const corsOptions = {
			origin: env === 'development' ? devOrigin : prodOrigin,
			allowedHeaders: ['Authorization', 'Content-Type', 'X-Requires-Auth'],
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
			credentials: true,
		};

		this.app.use(cors(corsOptions));
	}

	/**
	 * Load cloud modules dynamically
	 * 
	 * @param app - Express application instance
	 */
	private async loadCloudModules(_app: express.Express): Promise<void> {
		const isDevMode = process.env.NODE_ENV === 'development';
		const fileExtension = isDevMode ? 'ts' : 'js';

		// Adjust the base path depending on environment
		const baseDir = isDevMode
			? path.resolve(__dirname, '../../../..')
			: '/var/www/aianalist-backend';
		const modulesDir = isDevMode
			? path.join(baseDir, 'src/modules')
			: path.join(baseDir, 'dist', 'src/modules');

		console.log(green(`Loading modules from ${blue(baseDir)}`));

		console.log('✅ Ensuring Firebase Firestore is accessible...');
		// await testFirestoreAccess();
		
		await Promise.all(modules.map(moduleDir => this.loadModule(moduleDir, modulesDir, fileExtension)));
		console.log('✅ After loadModule');
		// Initialize and display routes after loading all modules
		const routeDisplay = new RouteDisplay(this.app);
		routeDisplay.displayRoutes();
	}

	// /**
	//  * Helper function to load a single cloud module
	//  * 
	//  * @param moduleDir - Directory of the module
	//  * @param modulesDir - Base directory where modules are located
	//  * @param fileExtension - File extension based on environment
	//  */
	private async loadModule(moduleDir: string, modulesDir: string, fileExtension: string): Promise<void> {
		const cloudFilePath = path.join(modulesDir, moduleDir + `.${fileExtension}`);
		console.log(green(`Loading module ${moduleDir} from ${blue(cloudFilePath)}`));

		if (fs.existsSync(cloudFilePath)) {
			try {
				const moduleImport = await import(cloudFilePath);
				const moduleRouter = moduleImport.default || moduleImport;

				if (moduleRouter && typeof moduleRouter === 'function') {
					this.app.use(moduleRouter);
					console.log(green(`Module ${blue(moduleDir)} loaded and routes attached.`));
				} else {
					console.warn(`Module ${blue(moduleDir)} does not export a valid router function.`);
				}
			} catch (error) {
				console.error(`Error loading module ${blue(moduleDir)}:`, error);
			}
		} else {
			console.warn(`Cloud file not found for module ${blue(moduleDir)}: ${cyan(cloudFilePath)}`);
		}
	}

	/**
	 * Create and configure the server (HTTP or HTTPS)
	 */
	private async createServer(): Promise<http.Server | https.Server> {
		let server: http.Server | https.Server;

		if (env === 'development') {
			server = http.createServer(this.app);
		} else {
			// SSL certificate paths for production
			const privateKeyPath = '/var/keys/privkey.pem';
			const certificatePath = '/var/keys/fullchain.pem';

			const credentials = {
				key: fs.readFileSync(privateKeyPath, 'utf8'),
				cert: fs.readFileSync(certificatePath, 'utf8')
			};

			server = https.createServer(credentials, this.app);
		}

		// Wrap the listen call with error handling
		server.listen(this.port)
			.on('listening', () => {
				this.logger.info(`Server started on port ${this.port} in ${env} mode`);
			})
			.on('error', (error: NodeJS.ErrnoException) => {
				this.handleServerError(error, server);
			});

		this.setupGlobalErrorHandlers();

		this.logger.info('Global error handlers configured');
		return server;
	}

	/**
	 * Setup global error handlers for uncaught exceptions and rejections
	 */
	private setupGlobalErrorHandlers(): void {
		process.on('uncaughtException', (error) => {
			this.logger.error('Uncaught Exception', error);
			process.exit(1);
		});

		process.on('unhandledRejection', (reason: unknown) => {
			const error = reason instanceof Error ? reason : new Error(String(reason));
			this.logger.error('Unhandled Rejection', error);
		});
	}

	/**
	 * Handle server errors such as 'EADDRINUSE'
	 */
	private handleServerError(error: NodeJS.ErrnoException, server: http.Server | https.Server): void {
		if (error.code === 'EADDRINUSE') {
			this.logger.error(`Port ${this.port} is already in use. Retrying on another port...`, error);
			// Retry with a random port
			server.listen(0);  // 0 means it will assign an available random port
		} else {
			this.logger.error('Error occurred while starting the server:', error);
			throw error;
		}
	}

	/**
	 * Start listening for connections
	 */
	async listen(): Promise<http.Server | https.Server> {
		try {
			await this.init();
			
			await this.loadCloudModules(this.app);  // Load cloud modules
			console.log('✅ After loadCloudModules');

			const server = await this.createServer();
			console.log('Server is now listening for connections');
			if (config.env == 'production') checkSystemOverload();

			return server;
		} catch (error) {
			this.logger.error('Failed to start server', error as Error);
			throw error;
		}
	}

	/**
	 * Log request details for debugging
	 */
	private showRequestUrl(req: express.Request, _: express.Response, next: express.NextFunction): void {
		const timestamp = new Date().toLocaleString();
		console.log(bgWhite("\n" + "showRequestUrl: " + timestamp));
		if (!isEmpty(req.originalUrl)) console.log('Request URL:', `${blueBright(req.headers.host ?? 'host_not_found')}${blue(req.originalUrl)}`);
		if (!isEmpty(req.method)) console.log('Method:', yellow(req.method));
		if (!isEmpty(req.body)) console.log('Body:', greenBright(JSON.stringify(req.body, null, 2)));
		if (!isEmpty(req.params)) console.log('Params:', JSON.stringify(req.params, null, 2));
		if (!isEmpty(req.query)) console.log('Query:', JSON.stringify(req.query, null, 2));
		console.log(bgMagenta("\n"));
		next();
	}

	/**
	 * Log and handle the response
	 */



}

// Initialize the AppService and start the server
const appService = AppService.getInstance();
const app = appService.app; // Export the Express app for testing
export { appService, app };

