import { ExtendedFunctionRequest } from '@/_core/guard/handle-permission/user-context.interface';
import _ERROR from '@/_core/helper/async-handler/error';
import _SUCCESS from '@/_core/helper/async-handler/success';
import { ControllerMethod } from '@/_core/helper/register-routes';
import { validateUser } from '@/_core/helper/validation/user';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import ErrorService from './error.service';

export class ErrorController {
    [key: string]: ControllerMethod | unknown; 

    constructor(private readonly errorService: ErrorService) {}

    /**
     * Handles Bad Request Error
     */
    public BadRequestError: RequestHandler = async (req: ExtendedFunctionRequest, res: Response, _next: NextFunction) => {
        const data = await this.errorService.BadRequestError(req.body.message);
        const message = 'Bad Request Error';
        new _SUCCESS.SuccessResponse({message, data}).setResponseTime(req.startTime).send(res);
    };

    /**
     * Handles Validation Error
     */
    public ValidationError: RequestHandler = async (req: Request, res: Response, _next: NextFunction) => {
        const validationErrors = validateUser(req.body);
        if (validationErrors.length > 0) {
            throw new _ERROR.ValidationError({
                message: 'Validation failed',
                errors: validationErrors,
            });
        }

        new _SUCCESS.SuccessResponse({
            message: 'Validation success',
            // metadata: await this.errorService.ValidationError(req.body),
        }).send(res);
    };
}