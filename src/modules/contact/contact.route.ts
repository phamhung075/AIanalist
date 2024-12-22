// contact.route.ts
import { asyncHandlerFn } from '@/_core/helper/async-handler/async-handler';
import { createRouter } from '@/_core/helper/create-router-path';
import contactController from './contact.controller.factory';

import {
  ContactIdSchema,
  CreateContactSchema,
  UpdateContactSchema
} from './contact.validation';
import { validateSchema } from '@/_core/middleware/validateSchema.middleware';

const router = createRouter(__filename);

// Create a new contact
router.post(
  '/contact',
  validateSchema(CreateContactSchema),
  asyncHandlerFn(async (req, res, next) => {
    await contactController.createContact(req, res, next);
  })
);


// Get all contacts
router.get(
  '/contacts',
  asyncHandlerFn(async (req, res) => {
    await contactController.getAllContacts(req, res);
  })
);

// Get a specific contact by ID
router.get(
  '/contact/:id',
  validateSchema(ContactIdSchema),
  asyncHandlerFn(async (req, res) => {
    await contactController.getContactById(req, res);
  })
);
// Update a contact by ID
router.put(
  '/contact/:id',
  validateSchema(UpdateContactSchema),
  asyncHandlerFn(async (req, res) => {
    await contactController.updateContact(req, res);
  })
)

// Delete a contact by ID
router.delete(
  '/contact/:id',
  validateSchema(ContactIdSchema),
  asyncHandlerFn(async (req, res) => {
    await contactController.deleteContact(req, res);
  })
);

export default router;
