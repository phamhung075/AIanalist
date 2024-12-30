import { Request, Response, NextFunction } from 'express';
import authController from './auth.controller.factory';

// Assuming validateSchema is synchronous
const registerAccountHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {    
    // validateSchema(CreateContactSchema)(req);
    return authController.register(req, res, next);
};


export {
  registerAccountHandler,
};