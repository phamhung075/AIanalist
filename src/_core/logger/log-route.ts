// src/_core/server/utils.ts
import { readFileSync } from 'fs';
import path from 'path';
import express from 'express';

// Function to log all routes
export function logRoutes(app: express.Express): void {
	const routes: any[] = [];

	// Iterate over the app's middleware stack
	app._router.stack.forEach((middleware: any) => {
		if (middleware.route) {
			console.log(`Route registered: [${Object.keys(middleware.route.methods)}] ${middleware.route.path}`);

			const route = middleware.route;
			routes.push({
				path: route.path,
				method: Object.keys(route.methods)[0]!.toUpperCase(),
			});
		} else if (middleware.name === 'router') {
			// Router middleware
			middleware.handle.stack.forEach((handler: any) => {
				if (handler.route) {
					routes.push({
						path: handler.route.path,
						method: Object.keys(handler.route.methods)[0]!.toUpperCase(),
					});
				}
			});
		}
	});

	// Output the registered routes to the console
	console.log('--------------------------------------------------------------------');
	console.log('Registered Routes:');
	routes.forEach(route => {
		console.log(`${route.method} ${route.path}`);
	});
	console.log('--------------------------------------------------------------------');
}

// Utility to load package.json
export const packageJson = JSON.parse(
	readFileSync(path.join(__dirname, '../../../package.json'), 'utf8')
);


