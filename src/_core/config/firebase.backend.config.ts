// firebase.config.ts
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getDatabase } from 'firebase-admin/database';
import { getAuth } from 'firebase-admin/auth';
import { yellow, red } from 'colorette';
import * as serviceAccount from '@environment/ai-analyst-14876-firebase-adminsdk-euw8h-cc2c8e8d9e.json';


// ✅ Initialize Firebase Admin SDK
let firebaseAdminApp;

try {
    if (!getApps().length) {
        firebaseAdminApp = initializeApp({
            credential: cert(serviceAccount as any),
            databaseURL: process.env.FIREBASE_DATABASE_URL || "https://ai-analyst-14876.firebaseio.com"
        });
        console.log(yellow('✅ Firebase Admin initialized'));
    } else {
        firebaseAdminApp = getApp();
        console.log(yellow('⚠️ Firebase Admin already initialized'));
    }
} catch (error) {
    console.error(red('❌ Failed to initialize Firebase Admin SDK:'), error);
}

// ✅ Initialize Services
const firestore = firebaseAdminApp ? getFirestore(firebaseAdminApp) : undefined;
const database = getDatabase(firebaseAdminApp);
const auth = getAuth(firebaseAdminApp);

// ✅ Test Firestore Connection
const testFirestoreAccess = async () => {
    if (!firestore) {
        console.error(red('❌ Firestore is not initialized'));
        return;
    }

    try {
        const snapshot = await firestore.collection('news').get();
        console.log(yellow(`✅ Firestore Test: ${snapshot.size} documents found.`));
    } catch (error) {
        console.error(red('❌ Error accessing Firestore:'), error);
    }
};

export {
    firebaseAdminApp,
    firestore,
    database,
    auth,
    testFirestoreAccess,
};