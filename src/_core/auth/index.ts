// import { config } from '../config/dotenv.config';
import { createHATEOASMiddleware, createRouter } from 'express-route-tracker';
import { config } from '@config/dotenv.config';
import { asyncHandler } from '../helper/asyncHandler';
import { getCurrentUserHandler, loginHandler, registerHandler, validateLoginDTO, validateRegisterDTO, verifyTokenHandler } from './auth.handler';

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
router.post('/login', validateLoginDTO, asyncHandler(loginHandler));
router.get('/current', asyncHandler(getCurrentUserHandler));
router.get('/verify', asyncHandler(verifyTokenHandler));

export = router;
