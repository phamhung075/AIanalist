// src/_core/auth/repositories/auth.repository.ts
// import * as admin from 'firebase-admin';
// import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, UserCredential } from 'firebase/auth';
// import { Auth, DecodedIdToken } from 'firebase-admin/auth';
// import { firebaseConfig } from '../config/dotenv.config';
// import { FirebaseApp } from 'firebase/app';

export class AuthRepository {
    // private firebaseClientAuth = getAuth();
    // private firebaseAdminAuth: Auth = admin.auth();

    // constructor() {
    //      // Initialize Firebase Admin SDK if not already initialized
    //      if (!admin.apps.length) {
    //         admin.initializeApp({
    //             credential: admin.credential.applicationDefault(),
    //             databaseURL: process.env.FIREBASE_DATABASE_URL,
    //         });
    //         console.log('✅ Firebase Admin SDK initialized successfully');
    //     }

  

    //     try {
    //         // Initialize the Firebase client app
    //         const clientApp = admin.initializeApp(firebaseConfig) as FirebaseApp;
    //         this.firebaseClientAuth = getAuth(clientApp);
    //         this.firebaseAdminAuth = admin.auth();
    //         console.log('✅ Firebase Client SDK initialized successfully');
    //     } catch (error: any) {
    //         console.error('Firebase initialization error:', error);
    //         throw new Error('Failed to initialize Firebase');
    //     }
    // }

    /**
     * Create new user in Firebase
     */
    async createUser(email: string, password: string) {
        // try {
        //     const userCredential = await createUserWithEmailAndPassword(
        //         this.firebaseClientAuth,
        //         email,
        //         password
        //     );
        //     return userCredential as UserCredential;
        // } catch (error: any) {
        //     console.error('Firebase Create User Error:', error.message || error);
        //     throw error; // Let service handle the error
        // }

        return "contact registed by" + email + password
    }

    // /**
    //  * Sign in existing user with Firebase
    //  */
    // async signInUser(email: string, password: string) {
    //     try {
    //         const userCredential = await signInWithEmailAndPassword(
    //             this.firebaseClientAuth,
    //             email,
    //             password
    //         );
    //         return userCredential;
    //     } catch (error: any) {
    //         console.error('Firebase Sign In Error:', error.message || error);
    //         throw error; // Let service handle the error
    //     }
    // }

    // /**
    //  * Verify Firebase token
    //  */
    // async verifyIdToken(token: string): Promise<DecodedIdToken> {
    //     try {
    //         return await this.firebaseAdminAuth.verifyIdToken(token);
    //     } catch (error: any) {
    //         console.error('Firebase Token Verification Error:', error.message || error);
    //         throw error;
    //     }
    // }

    // /**
    //  * Get user details from Firebase
    //  */
    // async getUserByUid(uid: string): Promise<admin.auth.UserRecord> {
    //     try {
    //         return await this.firebaseAdminAuth.getUser(uid);
    //     } catch (error: any) {
    //         console.error('Firebase Get User Error:', error.message || error);
    //         throw error;
    //     }
    // }
}

export default AuthRepository;