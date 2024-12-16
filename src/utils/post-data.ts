import { ref, push, get, serverTimestamp } from 'firebase/database';
import { database } from '../_core/server/firebase/firebase';  // Import Firebase config
import fs from 'fs';
import { getLatestFile } from './get-latest-file';


interface NewsItem {
    title: string;
    content: string;
    time: string;
    timestamp?: number;
    link: string;
}
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


export async function postUniqueDataToFirebase() {
    try {
        // Get the latest file path (assuming you have this function)
        const latestFilePath = getLatestFile();
        console.log(`Latest file found: ${latestFilePath}`);

        // Read and parse the file data
        const fileData = fs.readFileSync(latestFilePath, 'utf8');
        const parsedData: NewsItem[] = JSON.parse(fileData);

        // Get existing data from Firebase for comparison
        const newsRef = ref(database, 'news/');
        const snapshot = await get(newsRef);
        const existingData = snapshot.val() || {};

        // Create a map of existing timestamps for quick lookup
        const existingTimestamps = new Map();
        Object.values(existingData).forEach((item: any) => {
            const timestamp = getTimestampFromFirebaseItem(item);
            existingTimestamps.set(timestamp, true);
        });

        // Filter and post only new items
        let newItemsCount = 0;
        const currentTime = new Date().getTime();

        for (const newsItem of parsedData) {
            // Convert relative time to timestamp
            const timestamp = convertRelativeTime(newsItem.time);
            
            // Skip if the item is too old (more than 48 hours)
            if (currentTime - timestamp > 48 * 60 * 60 * 1000) {
                continue;
            }

            // Skip if we already have an item with this timestamp
            if (existingTimestamps.has(timestamp)) {
                continue;
            }

            // Post new item to Firebase
            await push(newsRef, {
                ...newsItem,
                timestamp: serverTimestamp(),
                processedTimestamp: timestamp // Store the processed timestamp for future comparison
            });
            newItemsCount++;
        }

        console.log(`Successfully posted ${newItemsCount} new items to Firebase!`);
    } catch (error) {
        console.error('Error posting data to Firebase:', error);
        throw error;
    }
}

function convertRelativeTime(relativeTime: string): number {
    const now = new Date().getTime();
    const timeString = relativeTime.toLowerCase();
    
    // Extract number and unit from time string
    const match = timeString.match(/(\d+)\s*(hour|minute|second)s?\s*ago/);
    if (!match) return now; // Default to current time if format doesn't match
    
    const [_, amount, unit] = match;
    const value = parseInt(amount);
    
    switch (unit) {
        case 'hour':
            return now - (value * 60 * 60 * 1000);
        case 'minute':
            return now - (value * 60 * 1000);
        case 'second':
            return now - (value * 1000);
        default:
            return now;
    }
}

function getTimestampFromFirebaseItem(item: any): number {
    // First try to get the processed timestamp
    if (item.processedTimestamp) {
        return item.processedTimestamp;
    }
    
    // If no processed timestamp, try to get it from the time field
    if (item.time) {
        // Handle relative time strings
        if (typeof item.time === 'string' && item.time.toLowerCase().includes('ago')) {
            return convertRelativeTime(item.time);
        }
        // Handle direct date strings
        return new Date(item.time).getTime();
    }
    
    // If no valid timestamp found, return current time
    return new Date().getTime();
}
