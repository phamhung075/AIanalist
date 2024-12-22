// routes.ts
import { createRouter } from '@src/_core/helper/create-router-path';
import { asyncHandlerFn } from '@src/_core/helper/async-handler/async-handler';
import { BaseController, registerRoutes, Routes } from '@/_core/helper/register-routes';
import { RequestHandler } from '@node_modules/@types/express';
import errorController from './error.controller.factory';
export interface IErrorController extends BaseController {
    BadRequestError: RequestHandler;
    ValidationError: RequestHandler;
}

const router = createRouter(__filename);

const routes: Routes<IErrorController> = {
    GET: {
        BadRequestError: 'bad-request'
    },
    // POST: {
    //     BadRequestError: 'bad-request',
    //     ValidationError: 'validation'
    // },
    // PUT: {
    //     BadRequestError: 'bad-request',
    //     ValidationError: 'validation'
    // },
    // DELETE: {
    //     BadRequestError: 'bad-request',
    //     ValidationError: 'validation'
    // },
    // PATCH: {
    //     BadRequestError: 'bad-request',
    //     ValidationError: 'validation'
    // }
};

registerRoutes<IErrorController>(router, routes, errorController, asyncHandlerFn);
export default router;