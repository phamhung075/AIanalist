import { onAuthStateChanged } from 'firebase/auth';
import { get, onValue, ref } from 'firebase/database';
import os from "os";
import process from "process";
import { auth, database } from "@/_core/database/firebase"; // Assuming you're using Firestore for logging/notifications

const _SECONDS = 10000;

// Firestore instance for sending notifications/logging (Firebase Admin must be initialized elsewhere in your app)

// Check system resource usage and log if there is an overload
export const checkSystemOverload = (): void => {
	setInterval(() => {
		const numCores = os.cpus().length;
		const memoryUsage = process.memoryUsage().rss;

		// Simulated connection usage (since Firebase handles connections, this is hypothetical)
		// const simulatedConnections = getSimulatedConnections();
		const maxConnections = numCores * 5; // Define your own threshold here

		console.log(`Memory usage :: ${memoryUsage / 1024 / 1024} MB`);
		console.log(`maxConnections accept :: ${maxConnections}`);

		// Monitor connection status with Realtime Database
		const connectedRef = ref(database, ".info/connected");
		onValue(connectedRef, (snapshot) => {
			const isConnected = snapshot.val();
			if (isConnected) {
				console.log("Connected to Realtime Database");
			} else {
				console.log("Disconnected from Realtime Database");
			}
		});

		// Monitor active authenticated users
		onAuthStateChanged(auth, (user) => {
			if (user) {
				console.log(`User signed in: ${user.email}`);
			} else {
				console.log("No user signed in");
			}
		});

		// Monitor Realtime Database read/writes (example of counting children in a specific path)
		const monitorDatabaseUsage = async () => {
			const dataRef = ref(database, 'news'); // Replace 'news' with your desired path
			const snapshot = await get(dataRef);
			const docCount = snapshot.size || 0; // size gives the number of child nodes
			console.log(`Number of documents (children) in Realtime Database: ${docCount}`);
		};

		monitorDatabaseUsage();
	}, _SECONDS); // Monitor every 5 seconds
};



// // Simulated function to get connections (since Firebase doesn't have direct connections like MongoDB)
// const getSimulatedConnections = (): number => {
// 	// Simulate a connection count (for example, number of active users or requests)
// 	// You can customize this based on Firebase metrics you want to track
// 	return Math.floor(Math.random() * 100); // Simulating active connections
// };
