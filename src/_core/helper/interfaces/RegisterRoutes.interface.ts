import { RequestHandler } from 'express';

/**
 * Represents a mapping of route paths to their handlers
 */
export interface RouteHandlers {
    [path: string]: RequestHandler;
}

/**
 * Represents a mapping of HTTP methods to their route handlers
 */
export interface Routes {
    GET?: RouteHandlers;
    POST?: RouteHandlers;
    PUT?: RouteHandlers;
    DELETE?: RouteHandlers;
    PATCH?: RouteHandlers;
    [method: string]: RouteHandlers | undefined;
}


/**
 * Generic Controller Type
 * @template T - Represents the shape of controller methods
 */
export type Controller<T extends Record<string, RequestHandler>> = T;

/**
 * Asynchronous Handler Function Type
 */
export type AsyncHandlerFn = (fn: RequestHandler) => RequestHandler;
