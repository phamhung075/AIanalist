// src/_core/config/index.ts
import dotenv from 'dotenv';
import path from 'path';

// First get the NODE_ENV
const env = process.env.NODE_ENV || 'development';

// Load base .env file first
dotenv.config();

// Then load environment specific .env file
const envFile = path.resolve(process.cwd(), `environment/.env.${env}`);
dotenv.config({ path: envFile });

export const config = {
    baseApi: process.env.BASE_API || '/api_v1',
    env: env
};