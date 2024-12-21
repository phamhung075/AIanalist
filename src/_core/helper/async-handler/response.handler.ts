// src/_core/utils/response.handler.ts
import { Response } from 'express';
import { HttpStatusCode } from './common/HttpStatusCode';
import { ApiError, ApiResponse } from '@src/_core/types/response.types';
import { PaginationMeta } from '../interfaces/rest.interface';

const { StatusCodes, ReasonPhrases } = HttpStatusCode;

export class RestHandler {
    static success<T>(
        res: Response, 
        {
            data,
            code = StatusCodes.OK,
            message = ReasonPhrases.OK,
            pagination,
            metadata = {}
        }: {
            data: T;
            code?: number;
            message?: string;
            pagination?: PaginationMeta;
            metadata?: Record<string, any>;
        }
    ): Response {
        const response: ApiResponse<T> = {
            success: true,
            code,
            message,
            data,
            metadata: {
                timestamp: new Date().toISOString(),
                status: this.getStatusText(code),
                path: res.req.originalUrl,
                ...metadata,
                ...(pagination && { pagination })
            }
        };

        return res.status(code).json(response);
    }

    static error(
        res: Response, 
        {
            code = StatusCodes.INTERNAL_SERVER_ERROR,
            message = ReasonPhrases.INTERNAL_SERVER_ERROR,
            errors = []
        }: {
            code: number;
            message: string;
            errors: ApiError[];
        }
    ): Response {
        const response: ApiResponse<null> = {
            success: false,
            code,
            message,
            data: null,
            metadata: {
                timestamp: new Date().toISOString(),
                status: this.getStatusText(code),
                path: res.req.originalUrl,
            },
            errors
        };

        return res.status(code).json(response);
    }

    private static getStatusText(code: number): string {
        return Object.entries(StatusCodes)
            .find(([_, value]) => value === code)?.[0] 
            || 'UNKNOWN_STATUS';
    }
}