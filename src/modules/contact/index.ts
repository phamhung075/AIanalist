// src\modules\contact\index.ts
import { createHATEOASMiddleware, createRouter } from 'express-route-tracker';
import {
  createHandler,
  deleteHandler,
  getAllsHandler,
  getByIdHandler,
  updateHandler,
  validateCreateDTO,
  validateIdDTO,
  validateUpdateDTO
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
router.post('/', validateCreateDTO, asyncHandler(createHandler));
router.get('/', asyncHandler(getAllsHandler));
router.get('/:id', validateIdDTO, asyncHandler(getByIdHandler));
router.put('/:id', validateIdDTO, validateCreateDTO, asyncHandler(updateHandler));
router.patch('/:id', validateIdDTO, validateUpdateDTO, asyncHandler(updateHandler));
router.delete('/:id', validateIdDTO, asyncHandler(deleteHandler));

export = router;
