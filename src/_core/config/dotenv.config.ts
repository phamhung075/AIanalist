// src/_core/config/dotenv.ts
import path from "path";
import { version, name } from "package.json";
import { isEmpty } from "lodash";

const env = process.env.NODE_ENV || "development";
const envFile = path.resolve(process.cwd(), `environment/.env.${env}`);

import dotenv from "dotenv";

console.log(`ℹ️ Chargement du fichier d'environnement: ${envFile}`);

try {
  dotenv.config({ path: envFile });
  console.log("✅ Variables d'environnement chargées avec succès.");
} catch (error) {
  console.error(
    `Échec du chargement du fichier d'environnement: ${envFile}`,
    error
  );
}

// App configuration object
export const config = {
  appName: name || "Unknown App",
  appVersion: version || "Unknown Version",
  baseApi: process.env.BASE_API || "/undefined",
  env: env || "development",
  mode: process.env.MODE || "development",
  port: process.env.PORT || 3000,
  host: process.env.HOST || "localhost",
  dbUri: process.env.DATABASE_URI || "mongodb://localhost:27017/mydatabase",
  dbName: process.env.DATABASE_NAME || "mydatabase",
  logDir: process.env.LOG_DIR || path.join(process.cwd(), "logs"),
  apiFrontend: process.env.API_FRONTEND || "localhost",
  get baseUrl() {
    return this.mode === "development"
      ? `${this.host}:${this.port}`
      : this.host;
  },
} as const;

// Firebase configuration
export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
} as const;

// Display configuration status
export function showConfig(): string {
  if (isEmpty(config)) {
    return "❌ Config not loaded";
  } else {
    return `✅ Config: ${JSON.stringify(config, null, 2)}
    `;
    // 🔑 Firebase Config: ${JSON.stringify(firebaseConfig, null, 2)}
  }
}

// Type definitions for config
export type Config = typeof config;
export type FirebaseConfig = typeof firebaseConfig;
