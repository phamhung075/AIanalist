import * as admin from 'firebase-admin';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { Auth, DecodedIdToken } from 'firebase-admin/auth';
import { Logger } from '../utils/logger';

// Ensure Firebase is initialized
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
    console.log('✅ Firebase Admin SDK initialized successfully');
}

export class AuthService {
    private readonly logger = new Logger('AuthService');
    private firebaseClientAuth = getAuth();
    private firebaseAdminAuth: Auth = admin.auth();

    /**
     * 🔐 User Registration (Firebase Client SDK)
     * @param email - User email
     * @param password - User password
     * @returns Token string
     */
    async register(email: string, password: string): Promise<string> {
        this.logger.log(`Registering user: ${email}`);
        try {
            const userCredential = await createUserWithEmailAndPassword(this.firebaseClientAuth, email, password);
            this.logger.log(`User registered successfully: ${userCredential.user.uid}`);
            return await userCredential.user.getIdToken();
        } catch (error: any) {
            this.logger.error('Firebase Auth Register Error:', error.message || error);
            if (error.code === 'auth/email-already-in-use') {
                throw new Error('Conflict: Email is already in use');
            }
            throw new Error('Failed to register user');
        }
    }

    /**
     * 🔐 User Login (Firebase Client SDK)
     * @param email - User email
     * @param password - User password
     * @returns Token string
     */
    async login(email: string, password: string): Promise<string> {
        this.logger.log(`Logging in user: ${email}`);
        try {
            const userCredential = await signInWithEmailAndPassword(this.firebaseClientAuth, email, password);
            this.logger.log(`User logged in successfully: ${userCredential.user.uid}`);
            return await userCredential.user.getIdToken();
        } catch (error: any) {
            this.logger.error('Firebase Auth Login Error:', error.message || error);
            if (
                error.code === 'auth/user-not-found' ||
                error.code === 'auth/wrong-password' ||
                error.code === 'auth/invalid-credential'
            ) {
                throw new Error('Unauthorized: Invalid email or password');
            }
            throw new Error('Failed to login');
        }
    }

    /**
     * 🔑 Verify Token (Firebase Admin SDK)
     * @param token - Firebase Auth token
     * @returns Decoded token
     */
    async verifyToken(token: string): Promise<DecodedIdToken> {
        this.logger.log(`Verifying token`);
        try {
            const decodedToken = await this.firebaseAdminAuth.verifyIdToken(token);
            this.logger.log(`Token verified successfully: ${decodedToken.uid}`);
            return decodedToken;
        } catch (error: any) {
            this.logger.error('Token Verification Error:', error.message || error);
            throw new Error('Unauthorized: Invalid or expired token');
        }
    }

    /**
     * 👤 Get User Details (Firebase Admin SDK)
     * @param uid - Firebase User UID
     * @returns User record
     */
    async getUser(uid: string): Promise<admin.auth.UserRecord> {
        this.logger.log(`Fetching user details for UID: ${uid}`);
        try {
            const userRecord = await this.firebaseAdminAuth.getUser(uid);
            this.logger.log(`User details fetched successfully: ${userRecord.email}`);
            return userRecord;
        } catch (error: any) {
            this.logger.error('Get User Error:', error.message || error);
            throw new Error('Failed to fetch user details');
        }
    }
}
