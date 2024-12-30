// src\modules\contact\index.ts
import { createHATEOASMiddleware, createRouter } from 'express-route-tracker';
import {
  createHandler,
  deleteHandler,
  getAllsHandler,
  getByIdHandler,
  updateHandler
} from './contact.handler';
import { asyncHandler } from '@/_core/helper/asyncHandler';
import { config } from '@/_core/config/dotenv.config';

// Create router with source tracking
const router = createRouter(__filename);

router.use(createHATEOASMiddleware(router, {
  autoIncludeSameRoute: true,
  baseUrl: config.baseUrl,
  includePagination: true,
  customLinks: {
      documentation: (_req) => ({
          rel: 'documentation',
          href: config.baseUrl+'/docs',
          method: 'GET',
          'title': 'API Documentation'
      })
  }
}));

// Define routes without baseApi prefix
router.post('/', asyncHandler(createHandler));
router.get('/', asyncHandler(getAllsHandler));
router.get('/:id', asyncHandler(getByIdHandler));
router.put('/:id', asyncHandler(updateHandler));
router.delete('/:id', asyncHandler(deleteHandler));

export = router;
