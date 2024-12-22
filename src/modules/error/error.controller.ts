import _ERROR from '@/_core/helper/async-handler/error';
import { validateUser } from '@/_core/helper/validation/user';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ErrorTestService } from './error.service';
import { ControllerMethod } from '@/_core/helper/register-routes';
import _SUCCESS from '@/_core/helper/async-handler/success';
import { ExtendedFunctionRequest } from '@/_core/guard/handle-permission/user-context.interface';

export class ErrorController {
    [key: string]: ControllerMethod | unknown; 

    constructor(private readonly errorService: ErrorTestService) {}

    /**
     * Handles Bad Request Error
     */
    public BadRequestError: RequestHandler = async (req: ExtendedFunctionRequest, res: Response, _next: NextFunction) => {
        const validationErrors = validateUser(req.body);
        if (validationErrors.length > 0) {
            throw new _ERROR.BadRequestError({
                message: 'Validation failed',
                errors: validationErrors,
            });
        }

        const data = await this.errorService.BadRequestError(req.body);
        const message = 'Bad Request Error';
        new _SUCCESS.SuccessResponse({message, data}).send(res);
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