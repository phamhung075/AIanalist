import { validateSchema } from "@/_core/helper/validateZodSchema";
import contactController from "./contact.controller.factory";
import { CreateContactSchema } from "./contact.validation";

import { Request, Response, NextFunction } from 'express';

// Assuming validateSchema is synchronous
const createContactHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    validateSchema(CreateContactSchema)(req);
    return contactController.createContact(req, res, next);
};


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