import { validateSchema } from "@/_core/helper/validateZodSchema";
import contactController from "./contact.controller.factory";
import { CreateContactSchema } from "./contact.validation";

import { Request, Response, NextFunction } from 'express';

// Assuming validateSchema is synchronous
const createContactHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {    
    validateSchema(CreateContactSchema)(req);
    return contactController.createContact(req, res, next);
};

const getAllContactsHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {    
  await contactController.getAllContacts(req, res, next);
}

const getContactByIdHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {    
  await contactController.getContactById(req, res, next);
}

const updateContactHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {    
  await contactController.updateContact(req, res, next);
}

const deleteContactHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {    
  await contactController.deleteContact(req, res, next);
}

export {
  createContactHandler,
  getAllContactsHandler,
  getContactByIdHandler,
  updateContactHandler,
  deleteContactHandler,
};