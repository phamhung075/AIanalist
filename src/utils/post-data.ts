import { ref, push, serverTimestamp } from 'firebase/database';
import { database } from '../_core/server/firebase/firebase';  // Import Firebase config
import fs from 'fs';
import { getLatestFile } from './get-latest-file';

/**
 * Read data from the latest file and post it to Firebase Realtime Database
 */
export async function postDataToFirebase() {
	try {
		// Get the latest file path
		const latestFilePath = getLatestFile();
		console.log(`Latest file found: ${latestFilePath}`);

		// Read the file data
		const fileData = fs.readFileSync(latestFilePath, 'utf8');

		// Parse the JSON data (assuming it's valid JSON)
		const parsedData = JSON.parse(fileData);

		// Get a reference to the 'news' section in Firebase
		const newsRef = ref(database, 'news/');

		// Post each news item to Firebase with serverTimestamp
		for (const newsItem of parsedData) {
			await push(newsRef, {
				...newsItem,
				timestamp: serverTimestamp()  // Add server timestamp
			});
		}

		console.log('Data posted to Firebase successfully!');
	} catch (error) {
		console.error('Error posting data to Firebase:', error);
	}
}

