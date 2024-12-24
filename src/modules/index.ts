//src\modules\index.ts
import { Request, Response, NextFunction } from 'express';
import { Router } from 'express';

const router = Router();


router.use('/api/contact', require('./contact'));
// router.use('/v1/api/error', require('./error'));

router.post('/', (_req: Request, res: Response, _next: NextFunction) => {
	return res.status(200).json({
		message: 'Welcome to AIAnalyst!'
	})
});


export default router;