import { validateSchema } from "@/_core/helper/validateZodSchema";
import { NextFunction, Request, Response } from 'express';
import { contactController } from "./contact.module";
import { IdSchema, CreateSchema, UpdateSchema } from "./contact.validation";


// Assuming validateSchema is synchronous
const createHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {    
    validateSchema(CreateSchema, "body")(req);
    return contactController.create(req, res, next);
};

const getAllsHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {    
  await contactController.getAll(req, res, next);
}

const getByIdHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {   
  validateSchema(IdSchema, "params")(req); 
  await contactController.getById(req, res, next);
}

const updateHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {    
  validateSchema(IdSchema, "params")(req); 
  validateSchema(UpdateSchema, "body")(req); 
  await contactController.update(req, res, next);
}

const deleteHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {    
  validateSchema(IdSchema, "params")(req); 
  await contactController.delete(req, res, next);
}

export {
  createHandler,
  deleteHandler,
  getAllsHandler,
  getByIdHandler,
  updateHandler
};

