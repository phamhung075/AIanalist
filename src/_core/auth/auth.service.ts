// src/_core/auth/services/auth.service.ts
// import { DecodedIdToken } from 'firebase-admin/auth';
// import { UserRecord } from 'firebase-admin/auth';
import { DecodedIdToken } from 'firebase-admin/auth';
import { UserCredential } from 'firebase/auth';
import AuthRepository from './auth.repository';

export class AuthService {
    private authRepository: AuthRepository;

    constructor(authRepository?: AuthRepository) {
        this.authRepository = authRepository || new AuthRepository();
    }

    /**
     * 🔐 User Registration
     * @param email - User email
     * @param password - User password
     * @returns Token string
     */
    async register(email: string, password: string): Promise<UserCredential> {
        try {
            console.log(`Registering user: ${email}`);
            const userCredential = await this.authRepository.createUser(email, password);
            console.log(`✅ User registered successfully: ${userCredential.user.uid}`);
            return userCredential;
        } catch (error: any) {
            console.error('❌ Registration Error:', error);

            // Handle known Firebase errors explicitly
            switch (error.code) {
                case 'auth/email-already-in-use':
                    throw new Error('Email is already in use');
                case 'auth/invalid-email':
                    throw new Error('Invalid email format');
                case 'auth/weak-password':
                    throw new Error('Password is too weak');
                default:
                    throw new Error('Failed to register user');
            }
        }
    }

    // /**
    //  * 🔐 User Login
    //  * @param email - User email
    //  * @param password - User password
    //  * @returns Token string
    //  */
    // async login(email: string, password: string): Promise<string> {
    //     try {
    //         console.log(`Logging in user: ${email}`);
    //         const userCredential = await this.authRepository.signInUser(email, password);
    //         console.log(`User logged in successfully: ${userCredential.user.uid}`);
    //         return await userCredential.user.getIdToken();
    //     } catch (error: any) {
    //         if (
    //             error.code === 'auth/user-not-found' ||
    //             error.code === 'auth/wrong-password' ||
    //             error.code === 'auth/invalid-credential'
    //         ) {
    //             throw new Error('Unauthorized: Invalid email or password');
    //         }
    //         console.error('Login Error:', error);
    //         throw new Error('Failed to login');
    //     }
    // }

    /**
     * 🔑 Verify Token
     * @param token - Firebase Auth token
     * @returns Decoded token
     */
    async verifyToken(token: string): Promise<DecodedIdToken> {
        try {
            console.log('Verifying token');
            const decodedToken = await this.authRepository.verifyIdToken(token);
            console.log(`Token verified successfully: ${decodedToken.uid}`);
            return decodedToken;
        } catch (error) {
            console.error('Token Verification Error:', error);
            throw new Error('Unauthorized: Invalid or expired token');
        }
    }

    // /**
    //  * 👤 Get User Details
    //  * @param uid - Firebase User UID
    //  * @returns User record
    //  */
    // async getUser(uid: string): Promise<UserRecord> {
    //     try {
    //         console.log(`Fetching user details for UID: ${uid}`);
    //         const userRecord = await this.authRepository.getUserByUid(uid);
    //         console.log(`User details fetched successfully: ${userRecord.email}`);
    //         return userRecord;
    //     } catch (error) {
    //         console.error('Get User Error:', error);
    //         throw new Error('Failed to fetch user details');
    //     }
    // }
}

export default AuthService;