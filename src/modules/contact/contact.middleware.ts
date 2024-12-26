import { validateSchema } from "@/_core/middleware/validateSchema.middleware";
import contactController from "./contact.controller.factory";
import { CreateContactSchema } from "./contact.validation";

import { Request, Response, NextFunction } from 'express';

// Assuming validateSchema is synchronous
async function createContactHandler(req: Request, res: Response, next: NextFunction) {
    try {
        validateSchema(CreateContactSchema)(req, res, next); // Middleware-style validation
        
        // Proceed with controller logic
        await contactController.createContact(req, res, next);
    } catch (error) {
        next(error); // Pass any errors to Express error handler
    }
}


async function getAllContactsHandler(req: any, res: any, next: any) {
  await contactController.getAllContacts(req, res, next);
}

async function getContactByIdHandler(req: any, res: any, next: any) {
  await contactController.getContactById(req, res, next);
}

async function updateContactHandler(req: any, res: any, next: any) {
  await contactController.updateContact(req, res, next);
}

async function deleteContactHandler(req: any, res: any, next: any) {
  await contactController.deleteContact(req, res, next);
}

export {
  createContactHandler,
  getAllContactsHandler,
  getContactByIdHandler,
  updateContactHandler,
  deleteContactHandler,
};