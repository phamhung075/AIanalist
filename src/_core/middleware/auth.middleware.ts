import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
import { RestHandler } from '../helper/http-status/common/RestHandler';
import { HttpStatusCode } from '../helper/http-status/common/HttpStatusCode';

// Ensure Firebase is initialized
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
    });
}

/**
 * Middleware to authenticate Firebase token
 */
export async function firebaseAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {

        return RestHandler.error(req, res, {
            code: HttpStatusCode.UNAUTHORIZED,
            message: 'Unauthorized: No token provided',
        });        
    }

    try {
        const decodedToken: admin.auth.DecodedIdToken = await admin.auth().verifyIdToken(token);
        (req as any).user = decodedToken; // Attach user info to request
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Firebase Auth Error:', error);
        return RestHandler.error(req, res, {
            code: HttpStatusCode.UNAUTHORIZED,
            message: 'Unauthorized: Invalid or expired token',
        });       
    }
}
