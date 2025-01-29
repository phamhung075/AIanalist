//src\modules\index.ts
// import { firebaseAuthMiddleware } from '@/_core/middleware/auth.middleware';
import { API_CONFIG } from '@/_core/helper/http-status/common/api-config';
import { NextFunction, Request, Response, Router } from 'express';

const router = Router();
router.post('/', (_req: Request, res: Response, _next: NextFunction) => {
	return res.status(200).json({
		message: 'Welcome to AIAnalyst!',
	});
});

// Auth routes - these should be protected except login/register
router.use(API_CONFIG.PREFIX + '/auth', require('../_core/auth/route').default);

router.use(API_CONFIG.PREFIX + '/contact', require('./contact/route').default);
// router.use('/api/trading-economics-new', firebaseAuthMiddleware, require('./trading-economics-new'));

// router.use('/v1/api/error', require('./error'));

export default router;
