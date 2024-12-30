import { firebaseConfig } from '@/_core/config/dotenv.config';
import { firebaseAdminAccount } from '@/_core/config/firebase-admin.account';
import { red, yellow } from 'colorette';
import { cert, getApp, getApps, initializeApp as initializeAdminApp } from 'firebase-admin/app';
import { getAuth as getAdminAuth, Auth as AdminAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';
import { getFirestore } from 'firebase-admin/firestore';
import { getApps as getClientApps, initializeApp as initializeClientApp, getApp as getClientApp } from 'firebase/app';
import { getAuth as getClientAuth, Auth as ClientAuth } from 'firebase/auth';

let firebaseAdminApp;
let firebaseClientApp;
let firebaseAdminAuth: AdminAuth;
let firebaseClientAuth: ClientAuth;

// ✅ Initialize Firebase Admin SDK
try {
    if (!getApps().length) {
        firebaseAdminApp = initializeAdminApp({
            credential: cert(firebaseAdminAccount as any),
            databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://ai-analyst-14876.firebaseio.com',
        });
        firebaseAdminAuth = getAdminAuth(firebaseAdminApp);
        console.log(yellow('✅ Firebase Admin initialized'));
    } else {
        firebaseAdminApp = getApp();
        firebaseAdminAuth = getAdminAuth(firebaseAdminApp);
        console.log(yellow('⚠️ Firebase Admin already initialized'));
    }
} catch (error) {
    console.error(red('❌ Failed to initialize Firebase Admin SDK:'), error);
    throw error;
}

// ✅ Initialize Firebase Client SDK
try {
    if (!getClientApps().length) {
        firebaseClientApp = initializeClientApp(firebaseConfig);
        firebaseClientAuth = getClientAuth(firebaseClientApp);
        console.log(yellow('✅ Firebase Client initialized'));
    } else {
        firebaseClientApp = getClientApp();
        firebaseClientAuth = getClientAuth(firebaseClientApp);
        console.log(yellow('⚠️ Firebase Client already initialized'));
    }
} catch (error) {
    console.error(red('❌ Failed to initialize Firebase Client SDK:'), error);
    throw error;
}

// ✅ Initialize Firestore and Realtime Database
const firestore = getFirestore(firebaseAdminApp);
const database = getDatabase(firebaseAdminApp);

// ✅ Test Firestore Access
async function testFirestoreAccess() {
    try {
        const testDoc = firestore.collection('test').doc('testDoc');
        await testDoc.set({ testField: 'testValue' });
        console.log(yellow('✅ Firestore access test successful'));
    } catch (error) {
        console.error(red('❌ Firestore access test failed:'), error);
    }
}

export {
    database,
    firebaseAdminApp,
    firebaseAdminAuth,
    firebaseClientApp,
    firebaseClientAuth,
    firestore,
    testFirestoreAccess,
};
