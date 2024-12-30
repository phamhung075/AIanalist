import { Auth } from 'firebase/auth';
import { firebaseAdminAuth } from '../config/firebase-admin.config';
import { initializeFirebaseClient, getFirebaseAuth } from '../config/firebase-client.config';
import { UserCredential, createUserWithEmailAndPassword } from 'firebase/auth';

export class AuthRepository {
    private firebaseClientAuth: Auth;

    constructor() {
        // Initialize Firebase Client if not already initialized
        initializeFirebaseClient();
        this.firebaseClientAuth = getFirebaseAuth();

        console.log('✅ Firebase Client Auth ready');
    }

    /**
     * Create new user in Firebase
     */
    async createUser(email: string, password: string): Promise<UserCredential> {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                this.firebaseClientAuth,
                email,
                password
            );
            console.log(`✅ User created: ${userCredential.user.uid}`);
            return userCredential;
        } catch (error: any) {
            console.error('Firebase Create User Error:', error.message || error);
            throw error;
        }
    }

    /**
     * Verify Firebase Token
     */
    async verifyIdToken(token: string): Promise<any> {
        try {
            return await firebaseAdminAuth.verifyIdToken(token);
        } catch (error: any) {
            console.error('Erreur de vérification du jeton Firebase:', error.message || error);
            throw error;
        }
    }
}
export default AuthRepository;