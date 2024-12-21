// src/modules/error/error.controller.ts
import { Response } from 'express';
import { StatusCodes } from '@src/_core/helper/async-handler/common/statusCodes';
import { ErrorTestService } from './error.service';
import { ExtendedUserContextRequest } from '@src/_core/guard/handle-permission/user-context.interface';
import { RestHandler } from '@src/_core/helper/async-handler/common/response.handler';

export class ErrorController {
    constructor(private readonly errorService: ErrorTestService) { }

    BadRequestError = async (req: ExtendedUserContextRequest, res: Response): Promise<Response> => {
        console.log('BadRequestError');
        console.log(req.body);
        const result = await this.errorService.BadRequestError(req.body);

        return RestHandler.success(res, result);

    };

    ValidationError = async (req: ExtendedUserContextRequest, res: Response): Promise<Response> => {
        try {
            await this.errorService.ValidationError({
                message: req.body.message,
                field: req.body.field,
                errors: req.body.errors
            });
        } catch (error: any) {
            return RestHandler.error(res, {
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: 'Validation failed',
                errors: error.errors || [{
                    code: 'VALIDATION_ERROR',
                    message: error.message,
                    field: error.field
                }]
            });
        }
        return RestHandler.error(res, {
            code: StatusCodes.UNPROCESSABLE_ENTITY,
            message: 'Validation failed',
            errors: [{
                code: 'VALIDATION_ERROR',
                message: 'Validation failed',
                field: 'field'
            }]
        });
    };
}