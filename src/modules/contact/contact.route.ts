// contact.route.ts
import { Router } from 'express';
import contactController from './contact.controller.factory';
import { validateSchema } from './contact.middleware';
import {
  CreateContactSchema,
  UpdateContactSchema,
  ContactIdSchema,
} from './contact.validation';

const router = Router();

// Create a new contact
router.post(
  '/',
  validateSchema(CreateContactSchema),
  (req, res) => contactController.createContact(req, res)
);

// Get all contacts
router.get('/', (req, res) => contactController.getAllContacts(req, res));

// Get a specific contact by ID
router.get(
  '/:id',
  validateSchema(ContactIdSchema),
  (req, res) => contactController.getContactById(req, res)
);

// Update a contact by ID
router.put(
  '/:id',
  validateSchema(UpdateContactSchema),
  (req, res) => contactController.updateContact(req, res)
);

// Delete a contact by ID
router.delete(
  '/:id',
  validateSchema(ContactIdSchema),
  (req, res) => contactController.deleteContact(req, res)
);

export default router;
