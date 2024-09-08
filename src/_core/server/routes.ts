// src/_core/server/routes.ts
import express from 'express';
import { ref, set } from 'firebase/database'; // Firebase Realtime Database methods
import { database } from './firebase';  // Import Firebase configuration
import { packageJson } from './utils';  // Utility to load package.json

const router = express.Router();

// Ping route
router.get('/ping', (_req, res) => {
	res.send('pong');
});

// Version route
router.get('/api_v1/version', (_req, res) => {
	res.json({
		name: packageJson.name,
		version: packageJson.version
	});
});

// Write test data to Firebase Realtime Database
router.get('/api_v1/write-test-data', async (_req, res) => {
	try {
		// Define the reference path in your database
		const dbRef = ref(database, 'test/data');

		// Write test data
		await set(dbRef, {
			testKey: 'testValue',
			timestamp: Date.now()
		});

		res.status(200).json({ message: 'Test data written successfully!' });
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
});

export default router;  // Ensure the router is exported as default
