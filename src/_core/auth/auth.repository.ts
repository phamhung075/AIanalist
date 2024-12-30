import { UserCredential, createUserWithEmailAndPassword } from 'firebase/auth';
import { firebaseAdminAuth, firebaseClientAuth } from '../database/firebase-admin-sdk';

export class AuthRepository {
    /**
     * Create new user in Firebase Authentication (Client SDK)
     */
    async createUser(email: string, password: string): Promise<UserCredential> {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                firebaseClientAuth,
                email,
                password
            );
            console.log(`✅ User created: ${userCredential.user.uid}`);
            return userCredential;
        } catch (error: any) {
            console.error('❌ Firebase Create User Error:', error.message || error);
            throw error;
        }
    }

    /**
     * Verify Firebase Token (Admin SDK)
     */
    async verifyIdToken(token: string): Promise<any> {
        try {
            const decodedToken = await firebaseAdminAuth.verifyIdToken(token);
            console.log('✅ Token verified successfully');
            return decodedToken;
        } catch (error: any) {
            console.error('❌ Firebase Token Verification Error:', error.message || error);
            throw error;
        }
    }
}

export default AuthRepository;
