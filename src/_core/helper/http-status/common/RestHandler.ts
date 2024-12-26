// src/_core/utils/response.handler.ts
import { Response } from 'express';
import { HttpStatusCode } from './StatusCodes';
import { PaginationResult, RestResponse } from '../../interfaces/rest.interface';
const { StatusCodes, ReasonPhrases } = HttpStatusCode;

export class RestHandler {
    static success<T>(res: Response, {
        data,     
        pagination,
        links,
        startTime,
        code = StatusCodes.OK,
        message = ReasonPhrases.OK,
    }: {
        data?: Partial<T> | Partial<T>[];
        code?: number;
        message?: string;
        pagination?: PaginationResult<T>;
        links?: RestResponse['metadata']['links'];
        startTime?: number;
        }): Response {
        const response: RestResponse<T> = {
            data,
            metadata: {
                code,
                status: this.getStatusText(code),
                message,
                timestamp: new Date().toISOString(),
                ...(pagination && { pagination }),
                ...(links && { links }),
            },
        };
        if (startTime) {
            response.metadata.responseTime = `${Date.now() - startTime}ms`;
        }
        return res.status(code).json(response);
    }

    static error(res: Response, {
        errors,
        code = StatusCodes.INTERNAL_SERVER_ERROR,
        message = ReasonPhrases.INTERNAL_SERVER_ERROR,
        startTime,
    }: {
        errors: RestResponse['errors'];
        code?: number;
        message?: string;
        startTime?: number;
        }): Response {      
        const response: RestResponse = {
            data: null,
            metadata: {
                code,
                status: this.getStatusText(code),
                message,
                timestamp: new Date().toISOString(),
            },
            errors
        };
        if (startTime) {
            response.metadata.responseTime = `${Date.now() - startTime}ms`;
        }
        return res.status(code).json(response);
    }

    private static getStatusText(code: number): string {
        return Object.entries(StatusCodes)
            .find(([_, value]) => value === code)?.[0] || 'UNKNOWN_STATUS';
    }
}