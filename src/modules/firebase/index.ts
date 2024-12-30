// src\modules\firebase\index.ts
import { createHATEOASMiddleware, createRouter } from '@node_modules/express-route-tracker/dist';
import {
  createFirebaseHandler,
  deleteFirebaseHandler,
  getAllFirebasesHandler,
  getFirebaseByIdHandler,
  updateFirebaseHandler
} from './firebase.handler';
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
router.post('/', asyncHandler(createFirebaseHandler));
router.get('/', asyncHandler(getAllFirebasesHandler));
router.get('/:id', asyncHandler(getFirebaseByIdHandler));
router.put('/:id', asyncHandler(updateFirebaseHandler));
router.delete('/:id', asyncHandler(deleteFirebaseHandler));

export = router;
