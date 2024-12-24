//src\modules\contact\contact.route.ts

import { asyncHandlerFn } from '@/_core/helper/async-handler/async-handler';

import contactController from './contact.controller.factory';
import {
  ContactIdSchema,
  CreateContactSchema,
  UpdateContactSchema
} from './contact.validation';
import { validateSchema } from '@/_core/middleware/validateSchema.middleware';
import { createRouter } from '@/_core/helper/create-router-path';

// Create router with source tracking
const router = createRouter(__filename);

// Define routes without baseApi prefix
// Collection routes
router.post(
  '/',  // Base route for collection
  validateSchema(CreateContactSchema),
  asyncHandlerFn(async (req, res, next) => {
    await contactController.createContact(req, res, next);
  })
);

router.get(
  '/',  // Base route for collection
  asyncHandlerFn(async (req, res, next) => {
    await contactController.getAllContacts(req, res, next);
  })
);

// Individual resource routes
router.get(
  '/:id',
  validateSchema(ContactIdSchema),
  asyncHandlerFn(async (req, res, next) => {
    await contactController.getContactById(req, res, next);
  })
);

router.put(
  '/:id',
  validateSchema(UpdateContactSchema),
  asyncHandlerFn(async (req, res, next) => {
    await contactController.updateContact(req, res, next);
  })
);

router.delete(
  '/:id',
  validateSchema(ContactIdSchema),
  asyncHandlerFn(async (req, res, next) => {
    await contactController.deleteContact(req, res, next);
  })
);

export = router;