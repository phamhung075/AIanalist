// types.ts
import { NextFunction, RequestHandler, Response } from 'express';
// register-routes.ts
import { Router } from 'express';
import { CustomRequest } from '../interfaces/CustomRequest.interface';

export type ControllerMethod = RequestHandler;
export type HttpMethods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface BaseController {
    [key: string]: ControllerMethod | unknown;
}

export type RouteHandlers<T extends BaseController> = {
    [P in keyof T]?: string;
};


export type Routes<T> = {
    [K in HttpMethods]?: {
        [P in keyof T]?: string;
    };
};

export type AsyncHandlerFn = (
    handler: RequestHandler
) => (
    req: CustomRequest, 
    res: Response, 
    next: NextFunction
) => Promise<void>;


export function registerRoutes<T extends BaseController>(
    router: Router,
    routes: Routes<T>,
    controller: T,
    asyncHandlerFn: AsyncHandlerFn
): void {
    Object.entries(routes).forEach(([method, handlers]) => {
        if (handlers) {
            Object.entries(handlers).forEach(([handlerName, path]) => {
                const httpMethod = method.toLowerCase() as keyof Router;
                if (typeof router[httpMethod] === 'function' && handlerName in controller) {
                    const handler = controller[handlerName] as RequestHandler;
                    (router[httpMethod] as Function)(
                        `/error/${path}`,
                        asyncHandlerFn(handler)
                    );
                } else {
                    console.warn(`Invalid handler: ${handlerName} for method: ${method}`);
                }
            });
        }
    });
}

