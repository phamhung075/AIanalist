// firebase.config.ts
import { initializeApp, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getDatabase } from 'firebase-admin/database';
import { getAuth } from 'firebase-admin/auth';
// import { firebaseConfig } from '@/_core/config/dotenv.config';
import { yellow, red } from 'colorette';
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
  firebaseAdminApp,
  firestore,
  database,
  auth,
  testFirestoreAccess,
};
