// src/_core/utils/response.handler.ts
import { Response } from 'express';
import { HttpStatusCode } from './common/StatusCodes';
import { PaginationResult } from '../interfaces/rest.interface';

const { StatusCodes, ReasonPhrases } = HttpStatusCode;

export interface ApiError {
    success?: false;
    status?: number;
    code?: number | string;
    message: string;
    errors?: any[];
    stack?: string;
    details?: any;
    metadata?: {
        responseTime?: string;
        timestamp: string;
        path?: string;
        [key: string]: any;
    };
}

export interface ApiSuccess<T> {
    success?: true;
    status?: number;
    message?: string;
    code?: number | string;
    data?: Partial<T>;
    links?: {
        self?: string;
        next?: string;
        prev?: string;
    }
    metadata?: {
        responseTime?: string;
        timestamp: string;
        path?: string;
        pagination?: PaginationResult<T>;
        [key: string]: any;
    };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

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
            pagination?: PaginationResult<T>;
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