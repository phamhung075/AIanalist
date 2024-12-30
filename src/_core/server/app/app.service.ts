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
import { API_CONFIG } from '@/_core/helper/http-status/common/api-config';
import { HttpStatusCode } from '@/_core/helper/http-status/common/HttpStatusCode';
import { RestHandler } from '@/_core/helper/http-status/common/RestHandler';
import { StatusCodes } from '@/_core/helper/http-status/common/StatusCodes';
import _ERROR from '@/_core/helper/http-status/error';
import { displayRequest } from '@/_core/middleware/displayRequest.middleware';
import { responseLogger } from '@/_core/middleware/responseLogger.middleware';
import router from "@modules/index";
import rateLimit from '@node_modules/express-rate-limit';
import { RouteDisplay } from '@node_modules/express-route-tracker/dist';
import helmet from '@node_modules/helmet/index.cjs';
import { isRunningWithNodemon } from '@src/_core/helper/check-nodemon';
import { blue, green, yellow } from 'colorette';
import { NextFunction, Request, Response } from 'express';

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
		this.setupRateLimit();
		this.setupJsonParser();
		app.use(displayRequest);
		app.use(responseLogger);
		// Initialize and display routes after loading all modules
		app.use("/", router);
		const routeDisplay = new RouteDisplay(app);
		routeDisplay.displayRoutes();

		/**
		 * 🟡 1️⃣ Catch 404 - Not Found Middleware (3 arguments)
		 * Handles requests to undefined routes.
		 */
		app.use((_req: Request, _res: Response, _next: NextFunction) => {
			throw new _ERROR.NotFoundError({
				message: 'The requested resource was not found.',
			});
		});

		/**
		 * 🟠 2️⃣ Specific Error Handling Middleware (4 arguments)
		 * Handles specific known error types.
		 */
		app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
			// 🔹 Malformed JSON in the request body
			if (err instanceof SyntaxError && err.message.includes('Unexpected')) {
				return res.status(HttpStatusCode.BAD_REQUEST).json({
					code: HttpStatusCode.BAD_REQUEST,
					message: 'Malformed JSON in request body. Please verify your payload.',
				});
			}

			// 🔹 Payload Too Large
			if (err.type === 'entity.too.large') {
				return res.status(HttpStatusCode.REQUEST_TOO_LONG).json({
					code: HttpStatusCode.REQUEST_TOO_LONG,
					message: 'Payload too large. Please reduce the request body size.',
				});
			}

			// 🔹 Unauthorized Access
			if (err.code === 'UNAUTHORIZED') {
				return res.status(HttpStatusCode.UNAUTHORIZED).json({
					code: HttpStatusCode.UNAUTHORIZED,
					message: 'Unauthorized access. Please provide valid credentials.',
				});
			}

			// 🔹 Forbidden Access
			if (err.code === 'FORBIDDEN') {
				return res.status(HttpStatusCode.FORBIDDEN).json({
					code: HttpStatusCode.FORBIDDEN,
					message: 'You do not have permission to access this resource.',
				});
			}

			// 🔹 Validation Errors
			if (err.name === 'ValidationError') {
				return res.status(HttpStatusCode.BAD_REQUEST).json({
					code: HttpStatusCode.BAD_REQUEST,
					message: 'Validation Error. Please check your input fields.',
					errors: err.errors || [],
				});
			}

			// 🔹 Timeout Errors
			if (err.code === 'ETIMEDOUT') {
				return res.status(HttpStatusCode.REQUEST_TIMEOUT).json({
					code: HttpStatusCode.REQUEST_TIMEOUT,
					message: 'The request timed out. Please try again later.',
				});
			}

			// Pass other errors to the global handler
			next(err);
		});

		/**
		 * 🔴 3️⃣ General Error Handling Middleware (4 arguments)
		 * Handles all uncaught errors and returns a consistent response format.
		 */
		app.use((error: any, req: Request, res: Response, _next: NextFunction) => {
			const statusCode = error.status || HttpStatusCode.INTERNAL_SERVER_ERROR;
			const message = error.message 
							|| StatusCodes[error.status as unknown as HttpStatusCode].phrase 
							|| StatusCodes[HttpStatusCode.INTERNAL_SERVER_ERROR].phrase;

			RestHandler.error(req, res, {
				code: statusCode,
				message,
				errors: error.errors || [],
				startTime: startTime
			});
		});
	}

	/**
	 * Setup Rate Limiting Middleware
	 */
	setupRateLimit(): void {
		app.use(rateLimit({
			windowMs: API_CONFIG.RATE_LIMIT.WINDOW_MS,
			max: API_CONFIG.RATE_LIMIT.MAX_REQUESTS,
			message: 'Too many requests from this IP, please try again later.',
			standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
			legacyHeaders: false, // Disable `X-RateLimit-*` headers
		}));
		console.log('✅ Rate limiting configured successfully.');
	}

	/**
	 * Setup JSON Parsing Middleware
	 */
	setupJsonParser(): void {
		app.use(express.json({
			limit: API_CONFIG.JSON.LIMIT,
		}));
		console.log(`✅ JSON body limit set to ${API_CONFIG.JSON.LIMIT}.`);
	}

	/**
	 * Setup CORS based on environment
	 */
	setupCors(): void {
		const corsOptions = {
			origin: (env === 'development'
				? [...API_CONFIG.CORS.ORIGINS.DEVELOPMENT] // Convert readonly to mutable array
				: [...API_CONFIG.CORS.ORIGINS.PRODUCTION]
			) as string[], // Explicitly cast to string[]
			allowedHeaders: [...API_CONFIG.CORS.ALLOWED_HEADERS], // Convert readonly to mutable array
			methods: [...API_CONFIG.CORS.METHODS], // Convert readonly to mutable array
			credentials: API_CONFIG.CORS.CREDENTIALS,
		};

		app.use(cors(corsOptions));
		console.log(`✅ CORS configured for ${env} environment.`);
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

