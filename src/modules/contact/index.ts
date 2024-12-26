// src\modules\contact\index.ts
import { asyncHandler } from '@/_core/helper/http-status/async-handler';
import { createRouter } from '@node_modules/express-route-tracker/dist';
import {
  createContactHandler,
  getAllContactsHandler
} from './contact.middleware';
// Create router with source tracking
const router = createRouter(__filename);

// Define routes without baseApi prefix
router.post('/', asyncHandler(createContactHandler));
router.get('/', asyncHandler(getAllContactsHandler));



// router.get('/:id', validateSchema(ContactIdSchema), asyncHandler(getContactByIdHandler));
// router.put('/:id', validateSchema(UpdateContactSchema), asyncHandler(updateContactHandler));
// router.delete('/:id', validateSchema(ContactIdSchema), asyncHandler(deleteContactHandler));

export = router;
