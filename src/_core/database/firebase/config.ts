// Import the functions you need from the SDKs you need
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getDatabase } from 'firebase/database'; // Import for Realtime Database

import { getAuth } from 'firebase/auth';  // For Authentication
import { firebaseConfig } from "@@src/_core/config";
import { yellow } from 'colorette';

// Your web app's Firebase configuration
// clear console
console.clear();
// Initialize Firebase
const app = initializeApp(firebaseConfig);

if (app) {
	console.log(yellow('✅ firebase initialized'));
} else {
	console.error('❌ firebase not initialized');
}

// export const analytics = getAnalytics(app);

// Initialize Firebase services
const database = getDatabase(app);
const firestore = getFirestore(app);
const auth = getAuth(app);

const testFirestoreAccess = async () => {
	try {
		const docsSnapshot = await getDocs(collection(firestore, 'news'));
		console.log(`Number of documents: ${docsSnapshot.size}`);
	} catch (error) {
		console.error('Error accessing Firestore:', error);
	}
};



// testFirestoreAccess();
export {
	app,
	database,
	firestore,
	auth,
	testFirestoreAccess
};