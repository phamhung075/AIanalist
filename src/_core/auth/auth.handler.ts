import { Request, Response, NextFunction } from 'express';
import { RegisterSchema, LoginSchema } from './auth.validation';
import { validateSchema } from '../helper/validateZodSchema';
import { authController } from './auth.module';

export const registerHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  validateSchema(RegisterSchema)(req);
  return authController.register(req, res, next);
};

export const loginHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  validateSchema(LoginSchema)(req);
  return authController.login(req, res, next);
};

export const getCurrentUserHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  return authController.getCurrentUser(req, res, next);
};

export const verifyTokenHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  return authController.verifyToken(req, res, next);
};