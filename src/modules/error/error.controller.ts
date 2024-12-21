import _ERROR from '@/_core/helper/async-handler/error';
import { _SUCCESS } from '@/_core/helper/async-handler/success';
import { validateUser } from '@/_core/helper/validation/user';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ErrorTestService } from './error.service';
import { ControllerMethod } from '@/_core/helper/register-routes';

export class ErrorController {
    [key: string]: ControllerMethod | unknown; 

    constructor(private readonly errorService: ErrorTestService) {}

    /**
     * Handles Bad Request Error
     */
    public BadRequestError: RequestHandler = async (req: Request, res: Response, _next: NextFunction) => {
        const validationErrors = validateUser(req.body);
        if (validationErrors.length > 0) {
            throw new _ERROR.BadRequestError({
                message: 'Validation failed',
                errors: validationErrors,
            });
        }

        new _SUCCESS.OKResponse({
            message: 'Create checkout success',
            metadata: await this.errorService.BadRequestError(req.body),
        }).send(res);
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

        new _SUCCESS.OKResponse({
            message: 'Validation success',
            // metadata: await this.errorService.ValidationError(req.body),
        }).send(res);
    };
}