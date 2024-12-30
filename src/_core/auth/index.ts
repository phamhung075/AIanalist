// import { config } from '../config/dotenv.config';
import { createHATEOASMiddleware, createRouter } from 'express-route-tracker';
import { config } from '@config/dotenv.config';
import { asyncHandler } from '../helper/asyncHandler';
import { registerHandler, validateRegisterDTO } from './auth.handler';

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

/**
 * 🔐 User Registration
 */
router.post('/registre', validateRegisterDTO, asyncHandler(registerHandler));

export = router;
