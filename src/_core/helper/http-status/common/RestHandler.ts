// src/_core/utils/response.handler.ts
import { Response } from 'express';
import { PaginationResult, RestResponse, ValidationError } from '../../interfaces/rest.interface';
import { logResponse } from '../response-log';
import { HttpStatusCode } from './HttpStatusCode';
import { StatusCodes } from './StatusCodes';
import { HATEOASLinks } from 'express-route-tracker';
import { CustomRequest } from '../../interfaces/CustomRequest.interface';
import { HttpMethod } from './api-config';

export class RestHandler {
    static success<T>(req: CustomRequest<T>, res: Response, {
        code = HttpStatusCode.OK,
        data,     
        message,
        pagination,
        links,
    }: {
        data?: Partial<T> | Partial<T>[];
        message?: string;
        code?: HttpStatusCode;
        pagination?: PaginationResult<T>;
        links?: HATEOASLinks;
        startTime?: number;
        }): Response {
        const response: RestResponse<T> = {
            success: true,
            code,
            message :  message || StatusCodes[code].phrase,            
            data,
            metadata: {                
                timestamp: new Date().toISOString(),
                statusCode: this.getStatusText(code),
                methode: res.req.method as HttpMethod,
                path: res.req.originalUrl,
                ...(pagination && { pagination }),
                ...(links && { links }),
                description: StatusCodes[code].description,
                documentation: StatusCodes[code].documentation,
            },
        };
        if (req.startTime) {
            response.metadata.responseTime = `${Date.now() - req.startTime}ms`;
        }
        return res.status(code).json(response);
    }

    static error<T>(req: CustomRequest<T>, res: Response, {
        code = HttpStatusCode.INTERNAL_SERVER_ERROR,
        message = StatusCodes[HttpStatusCode.INTERNAL_SERVER_ERROR].phrase,
        errors,
    }: {
        code?: HttpStatusCode;
        message?: string;
        errors?: ValidationError[];
        startTime?: number;
        }): Response {      
        const response: RestResponse = {
            success: false,
            code,
            message,
            errors,
            metadata: {
                timestamp: new Date().toISOString(),
                statusCode: this.getStatusText(code),
                description: StatusCodes[code].description,
                documentation: StatusCodes[code].documentation,
            },            
        };
        if (req.startTime) {
            response.metadata.responseTime = `${Date.now() - req.startTime}ms`;
        }
        logResponse(req, JSON.stringify(response, null, 2));
        return res.status(code).json(response);
    }

    static getStatusText(code: number): string {
        return Object.entries(HttpStatusCode)
            .find(([_, value]) => value === code)?.[0] || 'UNKNOWN_STATUS';
    }
}