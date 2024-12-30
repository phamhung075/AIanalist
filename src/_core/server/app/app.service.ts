import cors from 'cors'; // Correct way to import
import express from 'express';
import * as fs from "fs";
import * as http from "http";
import * as https from "https";
import * as path from "path";
import { checkSystemOverload } from '../../helper/check-system-overload/check-system-overload';
import { SimpleLogger } from '../../logger/simple-logger'; // Assuming SimpleLogger is used for logging
// Determine the environment and load the corresponding .env file
import { config, showConfig } from '@/_core/config/dotenv.config';
import { testFirestoreAccess } from '@/_core/database/firebase-admin-sdk';
import { responseLogger } from '@/_core/middleware/responseLogger.middleware';
import { displayRequest } from '@/_core/middleware/displayRequest.middleware';
import router from "@modules/index";
import { isRunningWithNodemon } from '@src/_core/helper/check-nodemon';
import { blue, green, yellow } from 'colorette';
import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from '@/_core/helper/http-status/common/HttpStatusCode';
import { RestHandler } from '@/_core/helper/http-status/common/RestHandler';
import { StatusCodes } from '@/_core/helper/http-status/common/StatusCodes';
import { RouteDisplay } from '@node_modules/express-route-tracker/dist';
import helmet from '@node_modules/helmet/index.cjs';
import rateLimit from '@node_modules/express-rate-limit';
import _ERROR, { ErrorResponse } from '@/_core/helper/http-status/error';


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
		const startTime = Date.now();
		this.setupCors();
		app.use(helmet());
		app.use(rateLimit({
			windowMs: 15 * 60 * 1000, // 15 minutes
			max: 100 // limit each IP to 100 requests per windowMs
		}));
		app.use(express.json({ limit: '50mb' }));
		app.use(express.urlencoded({ limit: '50mb', extended: true }));
		app.use(displayRequest);
		app.use(responseLogger);
		// Initialize and display routes after loading all modules
		app.use("/", router);
		const routeDisplay = new RouteDisplay(app);
		routeDisplay.displayRoutes();
		app.use ((_req: Request, _res: Response, next: NextFunction) => { //function middleware with 3 arguments
			const error = new _ERROR.NotFoundError()
			next(error)
		})
		app.use ((error : ErrorResponse, req: Request, res: Response, _next: NextFunction) => { // function catch error with 4 arguments
			const statusCode = error.status || HttpStatusCode.INTERNAL_SERVER_ERROR //500 if error.status is undefined
			RestHandler.error(req, res, {
				code: statusCode,
				message: error.message || StatusCodes[error.status as unknown as HttpStatusCode].phrase || StatusCodes[HttpStatusCode.INTERNAL_SERVER_ERROR].phrase,
				errors: error.errors,
				startTime
			});			
		})
	}

	/**
	 * Setup CORS based on environment
	 */
	setupCors(): void {
		const devOrigin = ['http://localhost:3333'];
		const prodOrigin = ['http://localhost:3333'];

		const corsOptions = {
			origin: env === 'development' ? devOrigin : prodOrigin,
			allowedHeaders: ['Authorization', 'Content-Type', 'X-Requires-Auth'],
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
			credentials: true,
		};

		app.use(cors(corsOptions));
	}


	/**
	 * Create and configure the server (HTTP or HTTPS)
	 */
	private async createServer(): Promise<http.Server | https.Server> {
		let server: http.Server | https.Server;

		if (env === 'development') {
			server = http.createServer(app);
		} else {
			// SSL certificate paths for production
			const privateKeyPath = '/var/keys/privkey.pem';
			const certificatePath = '/var/keys/fullchain.pem';

			const credentials = {
				key: fs.readFileSync(privateKeyPath, 'utf8'),
				cert: fs.readFileSync(certificatePath, 'utf8')
			};

			server = https.createServer(credentials, app);
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
			await testFirestoreAccess();

			const server = await this.createServer();
			console.log('Server is now listening for connections');
			if (config.env == 'production') checkSystemOverload();

			return server;
		} catch (error) {
			this.logger.error('Failed to start server', error as Error);
			throw error;
		}
	}
}

// Initialize the AppService and start the server
const appService = AppService.getInstance();
const app = appService.app; // Export the Express app for testing
export { app, appService };

