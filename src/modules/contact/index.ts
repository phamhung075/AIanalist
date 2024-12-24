// src\modules\contact\index.ts
import { asyncHandlerFn } from '@/_core/helper/async-handler/async-handler';
import contactController from './contact.controller.factory';
import {
  ContactIdSchema,
  CreateContactSchema,
  UpdateContactSchema
} from './contact.validation';
import { validateSchema } from '@/_core/middleware/validateSchema.middleware';
import { createRouter } from '@node_modules/express-route-tracker/dist';
// Create router with source tracking
const router = createRouter(__filename);

// Named Handlers
async function createContactHandler(req: any, res: any, next: any) {
  await contactController.createContact(req, res, next);
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

// Define routes without baseApi prefix
router.post('/', validateSchema(CreateContactSchema), asyncHandlerFn(createContactHandler));
router.get('/', asyncHandlerFn(getAllContactsHandler));
router.get('/:id', validateSchema(ContactIdSchema), asyncHandlerFn(getContactByIdHandler));
router.put('/:id', validateSchema(UpdateContactSchema), asyncHandlerFn(updateContactHandler));
router.delete('/:id', validateSchema(ContactIdSchema), asyncHandlerFn(deleteContactHandler));

export = router;
