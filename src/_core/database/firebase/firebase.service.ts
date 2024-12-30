import * as admin from 'firebase-admin';
import { getAuth, Auth, DecodedIdToken } from 'firebase-admin/auth';
import { Firestore } from 'firebase-admin/firestore';

// Ensure Firebase is initialized
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            // Or use service account:
            // credential: admin.credential.cert({
            //     projectId: process.env.FIREBASE_PROJECT_ID,
            //     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            //     privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            // }),
            databaseURL: process.env.FIREBASE_DATABASE_URL,
        });
        console.log('✅ Firebase Admin SDK initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize Firebase Admin SDK:', error);
        throw error;
    }
} else {
    console.log('⚡ Using existing Firebase Admin instance');
}

export class FirebaseService {
    private adminAuth: Auth;

    constructor() {
        this.adminAuth = getAuth(admin.app());
    }

    /**
     * Verify a Firebase authentication token.
     * @param token - The Firebase token to verify.
     * @returns Decoded token payload.
     */
    async verifyToken(token: string): Promise<DecodedIdToken> {
        try {
            return await this.adminAuth.verifyIdToken(token);
        } catch (error) {
            console.error('Token verification failed:', error);
            throw new Error('Invalid or expired token');
        }
    }

    /**
     * Get a user by UID from Firebase Authentication.
     * @param uid - The user's UID.
     * @returns User details from Firebase Authentication.
     */
    async getUser(uid: string): Promise<admin.auth.UserRecord> {
        try {
            return await this.adminAuth.getUser(uid);
        } catch (error) {
            console.error(`Failed to get user with UID ${uid}:`, error);
            throw new Error('Failed to retrieve user');
        }
    }

    /**
     * Get an instance of Firestore for database operations.
     * @returns Firestore instance.
     */
    getFirestore(): Firestore {
        return admin.firestore();
    }
}
