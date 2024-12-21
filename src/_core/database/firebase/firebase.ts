// Import the functions you need from the SDKs you need
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getDatabase } from 'firebase/database'; // Import for Realtime Database

import { getAuth } from 'firebase/auth';  // For Authentication

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyD3wHnK261YA8s-o8fT05aIRZYI78-UEKw",
	authDomain: "aianalist.firebaseapp.com",
	databaseURL: 'https://aianalist-default-rtdb.europe-west1.firebasedatabase.app',
	projectId: "aianalist",
	storageBucket: "aianalist.appspot.com",
	messagingSenderId: "235102289569",
	appId: "1:235102289569:web:f0fd1866b727827170fae0",
	measurementId: "G-4H4KL2LSJ5"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log ("firebase initialized");
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