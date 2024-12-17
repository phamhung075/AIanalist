import { get, orderByChild, push, query, ref, serverTimestamp, set, startAt } from 'firebase/database';
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
 * Post news data to Firebase after filtering by timestamp and duplicate titles.
 */
export async function postNewsDataToFirebase(): Promise<ProcessedDataPost> {
    // 1. Fetch the last processed data
    const lastProcessedData = await getLastProcessedData();
    const lastProcessedTimestamp = lastProcessedData?.lastNewTime || 0;
    const lastNewTitle = lastProcessedData?.lastNewTitle || '';
    console.log(`Last processed timestamp: ${lastProcessedTimestamp}`);
    console.log(`Last processed title: "${lastNewTitle}"`);

    // Initialize result variables
    const validItems: Array<NewsItem & { processedTimestamp: number }> = [];
    let totalValidItems = 0;
    let latestProcessedTimestamp = lastProcessedTimestamp;
    let latestNewTitle = lastNewTitle;

    try {
        // 2. Get the latest file path
        const latestFilePath = getLatestFile();
        console.log(`Latest file found: ${latestFilePath}`);

        // 3. Read and parse the file data
        const fileData = fs.readFileSync(latestFilePath, 'utf8');
        const parsedData: NewsItem[] = JSON.parse(fileData);

        // 4. Firebase references
        const newsRef = ref(database, 'news');
        const processRef = ref(database, 'process');

        // 5. Define current time
        const currentTime = new Date().getTime();

        // 6. Filter and post new items
        for (const newsItem of parsedData) {
            const processedTimestamp = convertRelativeTime(newsItem.time);

            // Skip old items (> 48 hours)
            if (currentTime - processedTimestamp > 48 * 60 * 60 * 1000) {
                console.log(`Skipping old item: ${newsItem.title}`);
                continue;
            }

            // Skip already processed items based on timestamp
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

            // Add to valid items
            validItems.push({
                ...newsItem,
                processedTimestamp,
            });

            // Update latest processed info
            totalValidItems++;
            if (processedTimestamp > latestProcessedTimestamp) {
                latestProcessedTimestamp = processedTimestamp;
                latestNewTitle = newsItem.title;
            }
        }

        console.log(`Successfully posted ${totalValidItems} new items to Firebase.`);

        // 7. Update the 'process' table with the latest data
        if (totalValidItems > 0) {
            await set(processRef, {
                lastNewTime: latestProcessedTimestamp,
                lastNewTitle: latestNewTitle,
            });
            console.log(
                `Updated 'process' table with lastNewTime: ${latestProcessedTimestamp} and lastNewTitle: "${latestNewTitle}"`
            );
        } else {
            console.log('No new items to update in the process table.');
        }

        // 8. Return the ProcessedDataPost object
        return {
            validItems,
            totalValidItems,
            lastNewTime: latestProcessedTimestamp,
            lastNewTitle: latestNewTitle,
        };
    } catch (error) {
        console.error('Error posting data to Firebase:', error);
    }

    // 9. Return an empty response in case of failure
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

// function getTimestampFromFirebaseItem(item: any): number {
//     // First try to get the processed timestamp
//     if (item.processedTimestamp) {
//         return item.processedTimestamp;
//     }
    
//     // If no processed timestamp, try to get it from the time field
//     if (item.time) {
//         // Handle relative time strings
//         if (typeof item.time === 'string' && item.time.toLowerCase().includes('ago')) {
//             return convertRelativeTime(item.time);
//         }
//         // Handle direct date strings
//         return new Date(item.time).getTime();
//     }
    
//     // If no valid timestamp found, return current time
//     return new Date().getTime();
// }





/**
 * Preview processed data: Filter items not in Firebase news and within 48 hours.
 */
export async function previewProcessedData(): Promise<ProcessedDataPost> {
    try {
        // 1. Fetch last processed data
        const lastProcessedData = await getLastProcessedData();
        const lastNewTime = lastProcessedData?.lastNewTime || 0;
        console.log(`Last processed time: ${lastNewTime}`);

        // 2. Fetch all news items from the last 24 hours for deduplication
        const newsRef = ref(database, 'news');
        const oneDayAgo = new Date().getTime() - 24 * 60 * 60 * 1000; // 24 hours ago
        const newsQuery = query(newsRef, orderByChild('processedTimestamp'), startAt(oneDayAgo));

        const snapshot = await get(newsQuery);
        const existingItems = snapshot.exists() ? Object.values(snapshot.val() || {}) : [];

        const existingTitles = new Set<string>();
        existingItems.forEach((item: any) => {
            if (item.title) existingTitles.add(item.title);
        });

        console.log(`Fetched ${existingTitles.size} existing titles from the last 24 hours.`);

        // 3. Get the latest file path
        const latestFilePath = getLatestFile();
        console.log(`Latest file found: ${latestFilePath}`);

        const fileData = fs.readFileSync(latestFilePath, 'utf8');
        const parsedData: NewsItem[] = JSON.parse(fileData);

        // 4. Filter new valid items
        const currentTime = new Date().getTime();
        const validItems: Array<NewsItem & { processedTimestamp: number }> = [];

        for (const newsItem of parsedData) {
            const processedTimestamp = convertRelativeTime(newsItem.time);

            // Skip old items (> 48 hours)
            if (currentTime - processedTimestamp > 48 * 60 * 60 * 1000) {
                console.log(`Skipping old item: ${newsItem.title}`);
                continue;
            }

            // Skip already processed items
            if (processedTimestamp <= lastNewTime) {
                console.log(`Skipping already processed item: ${newsItem.title}`);
                continue;
            }

            // Skip duplicates based on title
            if (existingTitles.has(newsItem.title)) {
                console.log(`Skipping duplicate title: ${newsItem.title}`);
                continue;
            }

            // Add to valid items
            validItems.push({
                ...newsItem,
                processedTimestamp,
            });
        }

        console.log(`Total new valid items ready for posting: ${validItems.length}`);
        console.table(validItems);

        // 5. Prepare and return response
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



