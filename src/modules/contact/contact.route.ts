// contact.route.ts
import { createRouter } from '@/_core/helper/create-router-path';
import contactController from './contact.controller.factory';
import { validateSchema } from './contact.middleware';
import {
  ContactIdSchema,
  CreateContactSchema,
  UpdateContactSchema,
} from './contact.validation';

const router = createRouter(__filename);
// Create a new contact
router.post(
  '/contact',
  validateSchema(CreateContactSchema),
  (req, res) => contactController.createContact(req, res)
);

// Get all contacts
router.get('/contacts', (req, res) => contactController.getAllContacts(req, res));

// Get a specific contact by ID
router.get(
  '/contact/:id',
  validateSchema(ContactIdSchema),
  (req, res) => contactController.getContactById(req, res)
);

// Update a contact by ID
router.put(
  '/contact/:id',
  validateSchema(UpdateContactSchema),
  (req, res) => contactController.updateContact(req, res)
);

// Delete a contact by ID
router.delete(
  '/contact/:id',
  validateSchema(ContactIdSchema),
  (req, res) => contactController.deleteContact(req, res)
);

export default router;
