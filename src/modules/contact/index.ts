// src\modules\contact\index.ts
import { createRouter } from '@node_modules/express-route-tracker/dist';
import {
  createContactHandler,
  deleteContactHandler,
  getAllContactsHandler,
  getContactByIdHandler,
  updateContactHandler
} from './contact.handler';
import { asyncHandler } from '@/_core/helper/asyncHandler';

// Create router with source tracking
const router = createRouter(__filename);

// Define routes without baseApi prefix
router.post('/', asyncHandler(createContactHandler));
router.get('/', asyncHandler(getAllContactsHandler));
router.get('/:id', asyncHandler(getContactByIdHandler));
router.put('/:id', asyncHandler(updateContactHandler));
router.delete('/:id', asyncHandler(deleteContactHandler));

export = router;
