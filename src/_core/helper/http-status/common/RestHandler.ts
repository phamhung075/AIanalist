// src/_core/utils/response.handler.ts
import { Response } from 'express';
import { PaginationResult, RestResponse } from '../../interfaces/rest.interface';
import { HttpStatusCode } from './HttpStatusCode';
import { StatusCodes } from './StatusCodes';

export class RestHandler {
    static success<T>(res: Response, {
        code = HttpStatusCode.OK,
        message = StatusCodes[HttpStatusCode.OK].phrase,
        data,     
        pagination,
        startTime,
        links,
    }: {
        data?: Partial<T> | Partial<T>[];
        message?: string;
        code?: HttpStatusCode;
        pagination?: PaginationResult<T>;
        links?: RestResponse['metadata']['links'];
        startTime?: number;
        }): Response {
        const response: RestResponse<T> = {
            success: true,
            code,
            message,            
            data,
            metadata: {                
                timestamp: new Date().toISOString(),
                statusCode: this.getStatusText(code),
                path: res.req.url,
                ...(pagination && { pagination }),
                ...(links && { links }),
                description: StatusCodes[code].description,
                documentation: StatusCodes[code].documentation,
            },
        };
        if (startTime) {
            response.metadata.responseTime = `${Date.now() - startTime}ms`;
        }
        return res.status(code).json(response);
    }

    static error(res: Response, {
        code = HttpStatusCode.INTERNAL_SERVER_ERROR,
        message = StatusCodes[HttpStatusCode.INTERNAL_SERVER_ERROR].phrase,
        errors,
        startTime,
    }: {
        code?: HttpStatusCode;
        message?: string;
        errors: RestResponse['errors'];
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
        if (startTime) {
            response.metadata.responseTime = `${Date.now() - startTime}ms`;
        }
        return res.status(code).json(response);
    }

    private static getStatusText(code: number): string {
        return Object.entries(HttpStatusCode)
            .find(([_, value]) => value === code)?.[0] || 'UNKNOWN_STATUS';
    }
}