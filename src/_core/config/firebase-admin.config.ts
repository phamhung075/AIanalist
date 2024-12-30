// src/config/firebase-admin.config.ts
import * as admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import serviceAccount from '@environment/ai-analyst-14876-firebase-adminsdk-euw8h-703ddf3555.json';

// Initialize Firebase Admin if it hasn't been initialized yet
function initializeFirebaseAdmin() {
    if (admin.apps.length) {
        console.log('⚡ Firebase Admin already initialized');
        return admin;
    }

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
    console.log('🔥 Firebase Client initialized successfully');
    return admin;
}

// Export the admin instance
const firebaseAdmin = initializeFirebaseAdmin();

// Export the auth instance
const firebaseAdminAuth = getAuth(firebaseAdmin.app());


export { 
    firebaseAdmin, 
    firebaseAdminAuth 
};