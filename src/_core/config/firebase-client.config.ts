// src/config/firebase-client.config.ts
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './dotenv.config';

let firebaseApp: FirebaseApp;
let firebaseAuth: Auth;

export const initializeFirebaseClient = () => {
    // Check if Firebase is already initialized
    if (!getApps().length) {
        if (
            !firebaseConfig.apiKey ||
            !firebaseConfig.authDomain ||
            !firebaseConfig.projectId ||
            !firebaseConfig.storageBucket ||
            !firebaseConfig.messagingSenderId ||
            !firebaseConfig.appId
        ) {
            throw new Error('Firebase configuration is missing required fields!');
        }

        firebaseApp = initializeApp(firebaseConfig);
        firebaseAuth = getAuth(firebaseApp);
        console.log('🔥 Firebase Client initialized successfully');
    } else {
        firebaseApp = getApp();
        firebaseAuth = getAuth(firebaseApp);
        console.log('⚡ Firebase Client already initialized');
    }

    return { firebaseApp, firebaseAuth };
};

// Export Firebase Auth and App for use elsewhere
export const getFirebaseAuth = () => {
    if (!firebaseAuth) {
        throw new Error('Firebase Client is not initialized. Call initializeFirebaseClient first.');
    }
    return firebaseAuth;
};

export const getFirebaseApp = () => {
    if (!firebaseApp) {
        throw new Error('Firebase Client is not initialized. Call initializeFirebaseClient first.');
    }
    return firebaseApp;
};
