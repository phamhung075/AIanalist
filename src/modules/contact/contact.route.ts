// contact.route.ts
import { asyncHandlerFn } from '@/_core/helper/async-handler/async-handler';
import { createRouter } from '@/_core/helper/create-router-path';
import contactController from './contact.controller.factory';
import { validateSchema } from './contact.middleware';
import {
  ContactIdSchema,
  UpdateContactSchema
} from './contact.validation';

const router = createRouter(__filename);
// Create a new contact
// Create a new contact
router.post(
  '/contact',
  (req, _res, next) => {
    console.log('Route hit:', req.path);
    console.log('Request body:', req.body);
    next();
  },
  // validateSchema(CreateContactSchema),
  asyncHandlerFn(async (req, res, next) => {
    console.log('Handler executing for path:', req.path);
    return await contactController.createContact(req, res, next);
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
