// src/_core/utils/response.handler.ts
import { Response } from 'express';
import { Link, PaginationResult, RestResponse } from '../../interfaces/rest.interface';
import { HttpStatusCode } from './HttpStatusCode';
import { StatusCodes } from './StatusCodes';
import { CustomRequest } from '@/_core/guard/handle-permission/user-context.interface';

export class RestHandler {
    static success<T>(req: CustomRequest, res: Response, {
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
        links?: Link;
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
                methode: res.req.method,
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

    static error(req: CustomRequest, res: Response, {
        code = HttpStatusCode.INTERNAL_SERVER_ERROR,
        message = StatusCodes[HttpStatusCode.INTERNAL_SERVER_ERROR].phrase,
        errors,
    }: {
        code?: HttpStatusCode;
        message?: string;
        errors?: RestResponse['errors'];
        startTime?: number;
        }): Response {      
        const response: RestResponse = {
            success: false,
            code,
            message,
            metadata: {
                timestamp: new Date().toISOString(),
                statusCode: this.getStatusText(code),
                description: StatusCodes[code].description,
                documentation: StatusCodes[code].documentation,
            },
            errors
        };
        if (req.startTime) {
            response.metadata.responseTime = `${Date.now() - req.startTime}ms`;
        }
        return res.status(code).json(response);
    }

    static getStatusText(code: number): string {
        return Object.entries(HttpStatusCode)
            .find(([_, value]) => value === code)?.[0] || 'UNKNOWN_STATUS';
    }
}