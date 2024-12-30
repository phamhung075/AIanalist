import { validateSchema } from "@/_core/helper/validateZodSchema";
import firebaseController from "./firebase.controller.factory";
import { CreateFirebaseSchema } from "./firebase.validation";

import { Request, Response, NextFunction } from 'express';

// Assuming validateSchema is synchronous
const createFirebaseHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {    
    validateSchema(CreateFirebaseSchema)(req);
    return firebaseController.createFirebase(req, res, next);
};

const getAllFirebasesHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {    
  await firebaseController.getAllFirebases(req, res, next);
}

const getFirebaseByIdHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {    
  await firebaseController.getFirebaseById(req, res, next);
}

const updateFirebaseHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {    
  await firebaseController.updateFirebase(req, res, next);
}

const deleteFirebaseHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {    
  await firebaseController.deleteFirebase(req, res, next);
}

export {
  createFirebaseHandler,
  getAllFirebasesHandler,
  getFirebaseByIdHandler,
  updateFirebaseHandler,
  deleteFirebaseHandler,
};