// firebase.config.ts
import { red, yellow } from 'colorette';
import { getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';
import { getFirestore } from 'firebase-admin/firestore';
import { firebaseConfig } from './dotenv.config';

// ✅ Initialize Firebase Admin SDK
let firebaseAdminApp;

if (!getApps().length) {
  firebaseAdminApp = initializeApp(firebaseConfig);
  console.log(yellow('✅ Firebase Admin initialized'));
} else {
  firebaseAdminApp = getApp();
  console.log(yellow('⚠️ Firebase Admin already initialized'));
}

// ✅ Initialize Services
const firestore = getFirestore(firebaseAdminApp);
const database = getDatabase(firebaseAdminApp);
const auth = getAuth(firebaseAdminApp);

// ✅ Test Firestore Connection
const testFirestoreAccess = async () => {
  try {
    const snapshot = await firestore.collection('news').get();
    console.log(yellow(`✅ Firestore Test: ${snapshot.size} documents found.`));
  } catch (error) {
    console.error(red('❌ Error accessing Firestore:'), error);
  }
};

export {
  auth, database, firebaseAdminApp,
  firestore, testFirestoreAccess
};
