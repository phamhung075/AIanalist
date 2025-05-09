import { BindMethods } from '@/_core/decorators/bind-methods.decorator';
import _ERROR from '@/_core/helper/http-status/error';
import _SUCCESS from '@/_core/helper/http-status/success';
import type { CustomRequest } from '@/_core/helper/interfaces/CustomRequest.interface';
import type { NextFunction, Response } from 'express';
import { Service } from 'typedi';
import { BaseController } from '../_base/crud/BaseController';
import { AIRequest, IAIRequestCreate } from './ai.interface';
import AIService from './ai.service';

@Service()
@BindMethods()
class AIController extends BaseController<AIRequest> {
	constructor(readonly aiService: AIService) {
		super(aiService);
	}

	async generateResponse(
		req: CustomRequest<IAIRequestCreate>,
		res: Response,
		next: NextFunction
	) {
		try {
			const result = await this.aiService.processRequest(req.body);
			return new _SUCCESS.OkSuccess({
				message: 'AI response generated successfully',
				data: result,
			}).send(res, next);
		} catch (error) {
			next(error);
		}
	}

	async getChatHistory(req: CustomRequest, res: Response, next: NextFunction) {
		try {
			const { chatId } = req.params;
			if (!chatId) {
				throw new _ERROR.BadRequestError({
					message: 'Chat ID is required',
				});
			}

			const history = await this.aiService.getChatHistory(chatId);
			return new _SUCCESS.OkSuccess({
				message: 'Chat history retrieved successfully',
				data: history,
			}).send(res, next);
		} catch (error) {
			next(error);
		}
	}

	async getById(req: CustomRequest, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const { page = 1, limit = 10 } = req.query;

			const entity = await this.aiService.getById(id);
			if (!entity) {
				throw new _ERROR.NotFoundError({ message: 'Chat not found' });
			}

			const history = await this.aiService.getChatHistory(
				entity.chatId as string,
				Number(page),
				Number(limit)
			);

			return new _SUCCESS.OkSuccess({
				message: 'Chat retrieved successfully',
				data: {
					...entity,
					history: history.slice(0, Number(limit)),
					totalHistory: history.length,
					currentPage: Number(page),
					hasMore: history.length > Number(limit),
				},
			}).send(res, next);
		} catch (error) {
			next(error);
		}
	}
}

export default AIController;
