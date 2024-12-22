import { ref, get, getDatabase, update } from "firebase/database";
import { database } from '@/_core/database/firebase';

/**
 * Convert relative time string to hours
 * @param {string} timeString - Time string like "15 hours ago"
 * @returns {number} Number of hours
 */
function parseRelativeTime(timeString : string) : number {
    const match = timeString.match(/(\d+)\s+(hour|hours|day|days)\s+ago/);
    if (!match) return Infinity;

    const [, number, unit] = match;
    const hours = unit.startsWith('day') ? parseInt(number) * 24 : parseInt(number);
    return hours;
}

/**
 * Retrieve and sort all content from the 'news/' node in Firebase.
 * @returns {Promise<Array>} Sorted news array
 */
export async function getAllContentFromFirebase() {
    try {
        const newsRef = ref(database, 'news/');
        const snapshot = await get(newsRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            const currentTimestamp = Date.now();

            const newsArray = Object.keys(data).map((key) => ({
                id: key,
                ...data[key],
                retrievedAt: currentTimestamp,
                hoursAgo: parseRelativeTime(data[key].time)
            }));

            // Sort the news array using multiple criteria
            newsArray.sort((a, b) => {
                // First, compare by hours ago
                const hoursDiff = a.hoursAgo - b.hoursAgo;
                if (hoursDiff !== 0) return hoursDiff;

                // If hours are same, compare by timestamp
                const timestampDiff = b.timestamp - a.timestamp;
                if (timestampDiff !== 0) return timestampDiff;

                // If timestamps are same, compare by retrievedAt
                return b.retrievedAt - a.retrievedAt;
            });

            // Remove the temporary hoursAgo property
            const cleanNewsArray = newsArray.map(({ hoursAgo, ...item }) => item);

            console.log("News data retrieved and sorted successfully:", {
                totalItems: cleanNewsArray.length,
                firstItem: cleanNewsArray[0],
                lastItem: cleanNewsArray[cleanNewsArray.length - 1]
            });

            return {
                message: "News data retrieved successfully!",
                data: cleanNewsArray
            };

        } else {
            console.log("No data available in 'news/' node.");
            return {
                message: "No news data available",
                data: []
            };
        }
    } catch (error : any) {
        console.error("Error retrieving news data from Firebase:", error);
        throw new Error(`Failed to retrieve news data: ${error.message}`);
    }
}

/**
 * Get specific news content by ID from Firebase
 * @param {string} id - The ID of the news item to retrieve
 * @returns {Promise<Object>} News item data
 */
export async function getContentById(id: string) {
    try {
        if (!id) {
            throw new Error('ID is required');
        }

        // Get a reference to the specific news item
        const newsRef = ref(database, `news/${id}`);
        const snapshot = await get(newsRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            const currentTimestamp = Date.now();

            // Return the data with additional metadata
            return {
                status: 'success',
                message: 'News item retrieved successfully',
                data: {
                    id,
                    ...data,
                    retrievedAt: currentTimestamp
                }
            };
        } else {
            return {
                status: 'error',
                message: `No news item found with ID: ${id}`,
                data: null
            };
        }
    } catch (error : any) {
        console.error("Error retrieving news item:", error);
        return {
            status: 'error',
            message: `Failed to retrieve news item: ${error.message}`,
            data: null,
            error: error.toString()
        };
    }
}


/**
 * Update timestamps for all news items in Firebase based on their relative time strings
 */
export async function updateNewsTimestamps() {
    const database = getDatabase();
    const newsRef = ref(database, 'news/');

    try {
        const snapshot = await get(newsRef);
        if (!snapshot.exists()) {
            console.log("No data available in 'news/' node.");
            return {
                message: "No news data to update",
                updatedCount: 0
            };
        }

        const data = snapshot.val();
        const currentTimestamp = Date.now();
        const updates: { [key: string]: any } = {};
        let updatedCount = 0;

        // Process each news item
        for (const [key, item] of Object.entries(data)) {
            const newsItem = item as any;
            if (!newsItem.time) continue;

            // Calculate hours ago
            const hoursAgo = parseRelativeTime(newsItem.time);
            if (hoursAgo === Infinity) continue;

            // Calculate new timestamp
            const newTimestamp = currentTimestamp - (hoursAgo * 60 * 60 * 1000);

            // Prepare update if timestamp has changed
            if (newsItem.processedTimestamp !== newTimestamp) {
                updates[`news/${key}/processedTimestamp`] = newTimestamp;
                updates[`news/${key}/lastUpdated`] = currentTimestamp;
                updatedCount++;
            }
        }

        // Apply updates if there are any
        if (Object.keys(updates).length > 0) {
            await update(ref(database), updates);
            console.log(`Successfully updated ${updatedCount} news items with new timestamps`);
        } else {
            console.log("No items needed timestamp updates");
        }

        return {
            message: "Timestamp update completed",
            updatedCount,
            timestamp: new Date().toISOString()
        };

    } catch (error: any) {
        console.error("Error updating timestamps:", error);
        throw new Error(`Failed to update timestamps: ${error.message}`);
    }
}



/**
 * Fetch the last processed data (lastNewTime and lastNewTitle) directly from the "process" table.
 */
export async function getLastProcessedData(): Promise<{
    lastNewTime?: number;
    lastNewTitle?: string;
}> {
    try {
        // Initialize the database reference to the "process" table
        const database = getDatabase();
        const processRef = ref(database, 'process');

        // Fetch the data directly from the "process" table
        const snapshot = await get(processRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            return {
                lastNewTime: data.lastNewTime || 0,
                lastNewTitle: data.lastNewTitle || '',
            };
        } else {
            console.log('No data found in the "process" table.');
            return { lastNewTime: 0, lastNewTitle: '' };
        }
    } catch (error) {
        console.error('Error fetching last processed data:', error);
        return { lastNewTime: 0, lastNewTitle: '' };
    }
}

