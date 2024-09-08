import { Request, Response, NextFunction } from 'express';
import { asyncHandlerFn } from '../asyncHandler/asyncHandler';

export const handleNonAuthRoutes = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
	return asyncHandlerFn(async (req: Request, res: Response, next: NextFunction) => {
		try {
			const result = await fn(req, res, next);

			if (!res.headersSent) {
				res.json({ result });
			}
		} catch (error: any) {
			res.status(500).json({
				error: true,
				message: error.message || 'An unexpected error occurred'
			});
		}
	});
};
