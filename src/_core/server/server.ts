import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';  // Correctly import default export from routes.ts
import { logRoutes } from './utils';  // Import utility function for logging routes

// Load environment variables based on the environment
const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `src/environment/.env.${env}` });

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware to use routes
app.use(routes);

// Start the server
app.listen(port, () => {
	console.log(`Server running at http://localhost:${port} in ${process.env.NODE_ENV} mode`);
	logRoutes(app); // Log all available routes
});
