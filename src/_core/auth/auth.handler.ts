import { Request, Response, NextFunction } from 'express';
import authController from './auth.controller.factory';
import { RegisterSchema } from './auth.validation';
import { validateSchema } from '../helper/validateZodSchema';

// Assuming validateSchema is synchronous
const registerAccountHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  validateSchema(RegisterSchema)(req);
  return authController.register(req, res, next);
};


export {
  registerAccountHandler,
};