import cors from 'cors';  // Correct way to import
import * as fs from "fs";
import * as path from "path";
import * as http from "http";
import * as https from "https";
import express from 'express';
import dotenv from 'dotenv';
import { SimpleLogger } from '../../utils/logger';  // Assuming SimpleLogger is used for logging
import { initializeApp } from 'firebase-admin/app';  // Firebase initialization
import routes from './../routes/routes';  // Correctly import default export from routes.ts


// Load environment variables based on the environment
const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `src/environment/.env.${env}` });

// Firebase initialization
initializeApp();

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

	// Load cloud modules dynamically (keeping the original function)
	private async loadCloudModules(app: express.Express): Promise<void> {
		const isDevMode = env === 'development';
		const fileExtension = isDevMode ? 'ts' : 'js';

		// Adjust the base path depending on environment
		const baseDir = isDevMode
			? path.resolve(__dirname, '../../../..')
			: '/var/www/offel-win-backend';

		const modulesDir = isDevMode
			? path.join(baseDir, 'modules')
			: path.join(baseDir, 'dist', 'modules');

		// List of modules to load
		const modules = [
			'_core/info',
			'trading-economics-new',
			//... other modules
		];

		const loadModule = async (moduleDir: string) => {
			const cloudFilePath = path.join(modulesDir, moduleDir, `cloud.${fileExtension}`);
			if (fs.existsSync(cloudFilePath)) {
				try {
					const moduleImport = await import(cloudFilePath);
					const moduleRouter = moduleImport.default || moduleImport;

					if (moduleRouter && typeof moduleRouter === 'function') {
						app.use(moduleRouter);
						console.log(`Module ${moduleDir} loaded and routes attached.`);
					} else {
						console.warn(`Module ${moduleDir} does not export a valid router function.`);
					}
				} catch (error) {
					console.error(`Error loading module ${moduleDir}:`, error);
				}
			} else {
				console.warn(`Cloud file not found for module ${moduleDir}: ${cloudFilePath}`);
			}
		};

		await Promise.all(modules.map(loadModule));
	}

	// Method to initialize the app and middleware
	private async init(): Promise<void> {
		const devOrigin = ['http://localhost:3333'];
		const prodOrigin = ['http://localhost:3333'];

		const corsOptions = {
			origin: env === 'development' ? devOrigin : prodOrigin,
			allowedHeaders: ['Authorization', 'Content-Type', 'X-Requires-Auth'],
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
			credentials: true,
		};

		this.app.use(cors(corsOptions));
		this.app.use(express.json({ limit: '50mb' }));
		this.app.use(express.urlencoded({ limit: '50mb', extended: true }));
		this.app.use(routes);  // External routes
		this.app.use(this.showRequestUrl);
		await this.loadCloudModules(this.app);  // Load cloud modules
		// logRoutes(this.app);  // Log routes after everything is set up

		// Error handling middleware can be added here if needed
	}

	// Create and configure the server
	// Create and configure the server
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
				if (error.code === 'EADDRINUSE') {
					this.logger.error(`Port ${this.port} is already in use. Retrying on another port...`, error);
					// Retry with a random port
					server.listen(0);  // 0 means it will assign an available random port
				} else {
					this.logger.error('Error occurred while starting the server:', error);
					throw error;
				}
			});
		// Global error handlers
		process.on('uncaughtException', (error) => {
			this.logger.error('Uncaught Exception', error);
			process.exit(1);
		});

		process.on('unhandledRejection', (reason: unknown) => {
			const error = reason instanceof Error ? reason : new Error(String(reason));
			this.logger.error('Unhandled Rejection', error);
		});

		this.logger.info('Global error handlers configured');
		return server;
	}


	// Start listening for connections
	async listen(): Promise<http.Server | https.Server> {
		try {
			await this.init();
			const server = await this.createServer();
			this.logger.info('Server is now listening for connections');
			return server;
		} catch (error) {
			this.logger.error('Failed to start server', error as Error);
			throw error;
		}
	}

	// Log request details for debugging
	private showRequestUrl(req: express.Request, _: express.Response, next: express.NextFunction): void {
		console.log('Request URL:', `${req.headers.host}${req.originalUrl}`);
		console.log('Method:', req.method);
		console.log('Body:', JSON.stringify(req.body, null, 2));
		console.log('Params:', JSON.stringify(req.params, null, 2));
		console.log('Query:', JSON.stringify(req.query, null, 2));
		next();
	}

}

// Initialize the AppService and start the server
const appService = new AppService();

export { appService };

