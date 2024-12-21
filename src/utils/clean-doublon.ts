import { ref, get, child, remove } from "firebase/database";
import { database } from '@database/firebase/config';  // Import Firebase config

/**
 * Clean duplicate data from the 'news' node in Firebase based on the `title` field.
 */
export async function cleanFirebaseData() {
    try {
        const newsRef = ref(database, 'news/');
        const snapshot = await get(newsRef);

        if (!snapshot.exists()) {
            console.log("No data available in 'news/' node.");
            return;
        }

        // Retrieve all data as an object
        const data = snapshot.val();
        const uniqueTitles = new Set<string>();
        const updates: Record<string, { title: string }> = {}; // To track updates for retaining unique entries
        const deletions: string[] = []; // To track duplicates for deletion

        for (const [key, item] of Object.entries(data as Record<string, { title: string }>)) {
            if (!uniqueTitles.has(item.title)) {
                uniqueTitles.add(item.title); // Keep unique titles
                updates[key] = item; // Retain the unique entry
            } else {
                deletions.push(key); // Mark duplicate for deletion
            }
        }

        console.log("Duplicate entries found:", deletions.length);

        // Remove duplicate entries from Firebase
        for (const key of deletions) {
            await remove(child(newsRef, key));
            console.log(`Deleted duplicate with key: ${key}`);
        }

        console.log("Firebase data cleaned successfully!");

    } catch (error) {
        console.error("Error cleaning Firebase data:", error);
    }
}
