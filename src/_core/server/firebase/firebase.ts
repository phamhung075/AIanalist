// Import the functions you need from the SDKs you need
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';  // For Firestore
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
export const database = getDatabase(app);
export const firestore = getFirestore(app);
export const auth = getAuth(app);