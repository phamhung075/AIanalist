import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import path from 'path';

// Load environment variables from .env file based on the environment
const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `src/environment/.env.${env}` });

const app = express();
const port = process.env.PORT || 3000;

// Load the package.json to extract the version and name
const packageJsonPath = path.join(__dirname, '../../package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

app.get('/ping', (_req: Request, res: Response) => {
	res.send('pong');
});

// /api/version endpoint
app.get('/api/version', (_req: Request, res: Response) => {
	res.json({
		name: packageJson.name,
		version: packageJson.version
	});
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port} in ${process.env.NODE_ENV} mode`);
});
