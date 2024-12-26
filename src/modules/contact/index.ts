// src\modules\contact\index.ts
import {
  ContactIdSchema,
  CreateContactSchema,
  UpdateContactSchema
} from './contact.validation';
import { validateSchema } from '@/_core/middleware/validateSchema.middleware';
import { createRouter } from '@node_modules/express-route-tracker/dist';
import {
  createContactHandler,
  deleteContactHandler,
  getAllContactsHandler,
  getContactByIdHandler,
  updateContactHandler
} from './contact.middleware';
import { asyncHandlerFn } from '@/_core/helper/http-status/async-handler';
// Create router with source tracking
const router = createRouter(__filename);

// Define routes without baseApi prefix
router.post('/', validateSchema(CreateContactSchema), asyncHandlerFn(createContactHandler));
router.get('/', asyncHandlerFn(getAllContactsHandler));
router.get('/:id', validateSchema(ContactIdSchema), asyncHandlerFn(getContactByIdHandler));
router.put('/:id', validateSchema(UpdateContactSchema), asyncHandlerFn(updateContactHandler));
router.delete('/:id', validateSchema(ContactIdSchema), asyncHandlerFn(deleteContactHandler));

export = router;
