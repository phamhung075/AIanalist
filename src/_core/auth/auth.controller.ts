import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
// import { firebaseAuthMiddleware } from '../middleware/firebase-auth.middleware';
// import { jwtAuthMiddleware } from '../middleware/jwt-auth.middleware';

const authService = new AuthService();

/**
 * User Registration
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const result = await authService.register(email, password);
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: result,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        next(error); // Pass errors to error handler
    }
};

/**
 * User Login
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            data: result,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        next(error); // Pass errors to error handler
    }
};

/**
 * Get Current User
 */
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user; // Access user from the request set by FirebaseAuthGuard
        const result = await authService.getUser(user.uid);
        res.status(200).json({
            success: true,
            message: 'User fetched successfully',
            data: result,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        next(error); // Pass errors to error handler
    }
};

/**
 * Verify User
 */
export const verify = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user; // Access user from the request set by FirebaseAuthGuard
        res.status(200).json({
            success: true,
            message: 'User verified successfully',
            data: user,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        next(error); // Pass errors to error handler
    }
};
