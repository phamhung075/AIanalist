// src/_core/config/dotenv.ts
import dotenv from 'dotenv';
import path from 'path';
import { version, name } from '../../../package.json';
const env = process.env.NODE_ENV || 'development';
import {isEmpty} from 'lodash';
// Load base .env file first
dotenv.config();

// Then load environment specific .env file
const envFile = path.resolve(process.cwd(), `environment/.env.${env}`);
dotenv.config({ path: envFile });

export const config = {
    appName: name || 'Unknown App',
    appVersion : version || 'Unknown Version',
    baseApi: process.env.BASE_API || '/undefined',
    env: env || 'development',
    mode: process.env.MODE || 'development',
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    dbUri: process.env.DATABASE_URI || 'mongodb://localhost:27017/mydatabase',
    dbName: process.env.DATABASE_NAME || 'mydatabase',
    logDir: process.env.LOG_DIR || 'logs',
    get baseUrl() {
        return this.mode === 'development' 
            ? `${this.host}:${this.port}`
            : this.host;
    }
};

export const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

export function showConfig(): string {
    if (isEmpty(config)) {
        return '❌ Config not loaded';
    } else {
        return `✅ Config: ${JSON.stringify(config, null, 2)}`;
    }
}


