import { get, push, ref, serverTimestamp, set } from 'firebase/database';
import fs from 'fs';
import { database } from '../_core/server/firebase/firebase'; // Import Firebase config
import { getLastProcessedData } from './get-data';
import { getLatestFile } from './get-latest-file';


export interface NewsItem {
    title: string;
    content: string;
    time: string;
    timestamp?: number;
    link: string;
}

export interface ProcessedDataPost {
    validItems: Array<NewsItem & { processedTimestamp: number }>;
    totalValidItems?: number;
    lastNewTime?: number;
    lastNewTitle?: string;
}


export interface UpdateProcess {
    lastNewTime?: number;
    lastNewTitle?: string;
}



/**
 * Post news data to Firebase, compare timestamps, and return ProcessedDataPost.
 * @param lastProcessedTimestamp - The timestamp of the last processed item.
 * @param lastNewTitle - (Optional) Title of the last processed item.
 */
export async function postNewsDataToFirebase(): Promise<ProcessedDataPost> {
    const lastProcessedData = await getLastProcessedData();
    const lastProcessedTimestamp = lastProcessedData?.lastNewTime || 0;
    const lastNewTitle = lastProcessedData?.lastNewTitle || '';
    console.log(`Last processed time: ${lastProcessedTimestamp}`);
    const validItems: Array<NewsItem & { processedTimestamp: number }> = [];
    let totalValidItems = 0;
    let latestProcessedTimestamp = lastProcessedTimestamp;
    let latestNewTitle = lastNewTitle || undefined;

    try {
        // 1. Get the latest file path
        const latestFilePath = getLatestFile();
        console.log(`Latest file found: ${latestFilePath}`);

        // 2. Read and parse the file data
        const fileData = fs.readFileSync(latestFilePath, 'utf8');
        const parsedData: NewsItem[] = JSON.parse(fileData);

        // 3. Firebase references
        const newsRef = ref(database, 'news');
        const processRef = ref(database, 'process');

        // 4. Define current time
        const currentTime = new Date().getTime();

        // 5. Filter and post new items
        for (const newsItem of parsedData) {
            const processedTimestamp = convertRelativeTime(newsItem.time);

            // Skip old or already processed items
            if (currentTime - processedTimestamp > 48 * 60 * 60 * 1000) {
                console.log(`Skipping old item: ${newsItem.title}`);
                continue;
            }

            if (processedTimestamp <= lastProcessedTimestamp) {
                console.log(`Skipping already processed item: ${newsItem.title}`);
                continue;
            }

            // Push new item to Firebase
            await push(newsRef, {
                ...newsItem,
                processedTimestamp,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            // Add to validItems
            validItems.push({
                ...newsItem,
                processedTimestamp,
            });

            // Track the latest processed item
            totalValidItems++;
            if (processedTimestamp > latestProcessedTimestamp) {
                latestProcessedTimestamp = processedTimestamp;
                latestNewTitle = newsItem.title;
            }
        }

        console.log(`Successfully posted ${totalValidItems} new items to Firebase.`);

        // 6. Update the 'process' table with the latest data
        if (latestProcessedTimestamp && latestNewTitle) {
            await set(processRef, {
                lastNewTime: latestProcessedTimestamp,
                lastNewTitle: latestNewTitle,
            });
            console.log(
                `Updated 'process' table with lastNewTime: ${latestProcessedTimestamp} and lastNewTitle: "${latestNewTitle}"`
            );
        }

        // 7. Return the ProcessedDataPost object
        return {
            validItems,
            totalValidItems,
            lastNewTime: latestProcessedTimestamp,
            lastNewTitle: latestNewTitle,
        };
    } catch (error) {
        console.error('Error posting data to Firebase:', error);
    }

    // Return empty response in case of failure
    return {
        validItems: [],
        totalValidItems: 0,
        lastNewTime: lastProcessedTimestamp,
        lastNewTitle,
    };
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




/**
 * Preview processed data before posting to Firebase.
 * This function calculates the processedTimestamp and filters items older than 48 hours.
 */
/**
 * Preview processed data before posting to Firebase.
 */
export async function previewProcessedData(): Promise<ProcessedDataPost> {
    try {
        const lastProcessedData = await getLastProcessedData();
        const lastNewTime = lastProcessedData?.lastNewTime || 0;
        console.log(`Last processed time: ${lastNewTime}`);

        const latestFilePath = getLatestFile();
        console.log(`Latest file found: ${latestFilePath}`);

        const fileData = fs.readFileSync(latestFilePath, 'utf8');
        const parsedData: NewsItem[] = JSON.parse(fileData);

        const currentTime = new Date().getTime();
        let validItems: Array<NewsItem & { processedTimestamp: number }> = [];

        for (const newsItem of parsedData) {
            const processedTimestamp = convertRelativeTime(newsItem.time);

            if (currentTime - processedTimestamp > 48 * 60 * 60 * 1000) {
                console.log(`Skipping old item: ${newsItem.title}`);
                continue;
            }

            if (processedTimestamp <= lastNewTime) {
                console.log(`Skipping already processed item: ${newsItem.title}`);
                continue;
            }

            validItems.push({
                ...newsItem,
                processedTimestamp,
            });
        }

        console.log(`Total new valid items ready for posting: ${validItems.length}`);
        console.table(validItems);

        const response: ProcessedDataPost = {
            validItems: validItems,
            totalValidItems: validItems.length,
            lastNewTime: validItems.length > 0 ? validItems[validItems.length - 1].processedTimestamp : lastNewTime,
            lastNewTitle: validItems.length > 0 ? validItems[validItems.length - 1].title : lastProcessedData.lastNewTitle,
        };

        console.log('Response being returned:', response);
        return response;
    } catch (error) {
        console.error('Error previewing processed data:', error);
    }

    return {
        validItems: [],
        totalValidItems: 0,
        lastNewTime: 0,
        lastNewTitle: '',
    };
}


/**
 * Reads all data from the 'news' table, finds the latest news item (based on processedTimestamp),
 * and updates the 'process' table with lastNewTime and lastNewTitle.
 */
export async function updateLastProcessedData() : Promise<UpdateProcess> {
    try {
        // References to 'news' and 'process' tables in Firebase
        const newsRef = ref(database, 'news/');
        const processRef = ref(database, 'process/');

        console.log('Fetching all news items from Firebase...');

        // Get all data from the 'news' table
        const snapshot = await get(newsRef);
        const newsData = snapshot.val();

        // Check if data exists
        if (!newsData) {
            console.log('No news data found in Firebase.');
            return {
                lastNewTime: 0,
                lastNewTitle: '',
            };
        }

        let lastNewTitle: string | null = null;
        let lastNewTime: number | null = null;

        // Iterate through all news items to find the latest one
        Object.values(newsData).forEach((item: any) => {
            const processedTimestamp = item.processedTimestamp || 0;

            // Update if this item has a more recent timestamp
            if (!lastNewTime || processedTimestamp > lastNewTime) {
                lastNewTime = processedTimestamp;
                lastNewTitle = item.title || 'Untitled';
            }
        });

        // Log the results
        console.log(`Latest news found: "${lastNewTitle}" at timestamp ${lastNewTime}`);

        // Update the 'process' table with the latest news data
        if (lastNewTime && lastNewTitle) {
            await set(processRef, {
                lastNewTime: lastNewTime,
                lastNewTitle: lastNewTitle,
            });
            console.log('Successfully updated the process table with the latest news data.');
        } else {
            console.log('No valid news items found to update the process table.');
        }

        return {
            lastNewTime: lastNewTime as unknown as number,
            lastNewTitle: lastNewTitle as unknown as string,
        };
    } catch (error) {
        console.error('Error reading news data or updating process table:', error);
        throw error;
    }

}



