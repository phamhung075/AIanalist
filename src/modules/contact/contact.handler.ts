import { validateSchema } from "@/_core/helper/validateZodSchema";
import { NextFunction, Request, Response } from 'express';
import { contactController } from "./contact.module";
import { ContactIdSchema, CreateContactSchema, UpdateContactSchema } from "./contact.validation";


// Assuming validateSchema is synchronous
const createContactHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {    
    validateSchema(CreateContactSchema, "body")(req);
    return contactController.createContact(req, res, next);
};

const getAllContactsHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {    
  await contactController.getAllContacts(req, res, next);
}

const getContactByIdHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {   
  validateSchema(ContactIdSchema, "params")(req); 
  await contactController.getContactById(req, res, next);
}

const updateContactHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {    
  validateSchema(ContactIdSchema, "params")(req); 
  validateSchema(UpdateContactSchema, "body")(req); 
  await contactController.updateContact(req, res, next);
}

const deleteContactHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {    
  validateSchema(ContactIdSchema, "params")(req); 
  await contactController.deleteContact(req, res, next);
}

export {
  createContactHandler,
  deleteContactHandler,
  getAllContactsHandler,
  getContactByIdHandler,
  updateContactHandler
};

