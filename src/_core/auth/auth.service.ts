// src/_core/auth/services/auth.service.ts
import { DecodedIdToken, UserRecord } from 'firebase-admin/auth';
import { UserCredential } from 'firebase/auth';
import _ERROR from '../helper/http-status/error';
import { IRegister } from './auth.interface';
import AuthRepository from './auth.repository';
import ContactService from '@/modules/contact/contact.service';

export class AuthService {
    constructor(
        private authRepository: AuthRepository,
        private contactService: ContactService
    ) {}

    async register(registerData: IRegister): Promise<UserCredential> {
        const { email, password, ...contactData } = registerData;
        
        const userCred = await this.authRepository.createUser({ email, password });
        
        await this.contactService.createWithId(userCred.user.uid, {
            ...contactData,
            email,
        });
        
        return userCred;
     }

     async login(email: string, password: string): Promise<{ token: string; refreshToken: string }> {
        try {
            console.log(`Logging in user: ${email}`);
            const userCredential = await this.authRepository.loginUser(email, password);
            
            const user = userCredential.user;
            console.log(`✅ User logged in successfully: ${user.uid}`);
    
            const token = await user.getIdToken();
            const refreshToken = user.refreshToken; // Retrieve the refresh token
    
            return { token, refreshToken };
        } catch (error: any) {
            console.error('❌ Login Error:', error);
            if (['auth/user-not-found', 'auth/wrong-password', 'auth/invalid-credential'].includes(error.code)) {
                throw new _ERROR.UnauthorizedError({
                    message: 'Invalid email or password'
                });
            }
            throw new _ERROR.UnauthorizedError({
                message: 'Failed to login'
            });
        }
    }
    

    async verifyToken(token: string): Promise<DecodedIdToken> {
        try {
            const decodedToken = await this.authRepository.verifyIdToken(token);
            console.log(`✅ Token verified successfully: ${decodedToken.uid}`);
            return decodedToken;
        } catch (error) {
            throw new _ERROR.UnauthorizedError({
                message: 'Invalid or expired token'
            });
        }
    }

    async getUser(uid: string): Promise<UserRecord> {
        try {
            console.log(`Fetching user details for UID: ${uid}`);
            const userRecord = await this.authRepository.getUserById(uid);
            console.log(`✅ User details fetched successfully: ${userRecord.email}`);
            return userRecord;
        } catch (error) {
            throw new _ERROR.UnauthorizedError({
                message: 'Failed to fetch user details'
            });
        }
    }
}

export default AuthService;