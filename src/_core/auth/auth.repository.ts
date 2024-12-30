import { UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { UserRecord } from 'firebase-admin/auth';
import { firebaseAdminAuth, firebaseClientAuth } from '../database/firebase-admin-sdk';
import { DecodedIdToken } from 'firebase-admin/auth';
import { IAuth } from './auth.interface';
import _ERROR from '../helper/http-status/error';

class AuthRepository {
    async createUser(account: IAuth): Promise<UserCredential> {
        try {
            return await createUserWithEmailAndPassword(firebaseClientAuth, account.email, account.password);
        } catch (error: any) {
            switch (error.code) {
                case 'auth/email-already-in-use':
                    throw new _ERROR.ConflictError({ message: 'Email is already in use' });
                case 'auth/invalid-email':
                    throw new _ERROR.BadRequestError({ message: 'Invalid email format' });
                case 'auth/weak-password':
                    throw new _ERROR.BadRequestError({ message: 'Password is too weak' });
                default:
                    throw new _ERROR.InternalServerError({ message: 'Failed to register user' });
            }
        }
    }

    async loginUser(email: string, password: string): Promise<UserCredential> {
        try {
            return await signInWithEmailAndPassword(
                firebaseClientAuth,
                email,
                password
            );
        } catch (error: any) {
            console.error('❌ Firebase Login Error:', error);
            throw error;
        }
    }

    async verifyIdToken(token: string): Promise<DecodedIdToken> {
        try {
            return await firebaseAdminAuth.verifyIdToken(token);
        } catch (error: any) {
            console.error('❌ Firebase Token Verification Error:', error);
            throw error;
        }
    }

    async getUserById(uid: string): Promise<UserRecord> {
        try {
            return await firebaseAdminAuth.getUser(uid);
        } catch (error: any) {
            console.error('❌ Firebase Get User Error:', error);
            throw error;
        }
    }
}

export default AuthRepository;