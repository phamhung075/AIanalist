// src/_core/utils/response.handler.ts
import { Response } from 'express';
import { HttpStatusCode } from './common/HttpStatusCode';
import { PaginationMeta } from '../interfaces/rest.interface';
import { ApiError, ApiResponse } from '@src/_core/types/response.types';

const { StatusCodes, ReasonPhrases } = HttpStatusCode;

export class RestHandler {
    static success<T>(res: Response, {
        data,
        code = StatusCodes.OK,
        message = ReasonPhrases.OK,
        pagination,
        meta = {}
    }: {
        data: T;
        code?: number;
        message?: string;
        pagination?: PaginationMeta;
        meta?: Record<string, any>;
    }): Response {
        const response: ApiResponse<T> = {
            success: true,
            data,
            meta: {
                code,
                status: this.getStatusText(code),
                message,
                timestamp: new Date().toISOString(),
                ...meta,
                ...(pagination && { pagination })
            }
        };

        return res.status(code).json(response);
    }

    static error(res: Response, {
        code = StatusCodes.INTERNAL_SERVER_ERROR,
        message = ReasonPhrases.INTERNAL_SERVER_ERROR,
        errors = []
    }: {
        code: number;
        message: string;
        errors: ApiError[];
    }): Response {
        const response: ApiResponse = {
            success: false,
            data: null,
            meta: {
                code,
                status: this.getStatusText(code),
                message,
                timestamp: new Date().toISOString()
            },
            errors
        };

        return res.status(code).json(response);
    }

    private static getStatusText(code: number): string {
        return Object.entries(ReasonPhrases)
            .find(([_, value]) => StatusCodes[value as keyof typeof StatusCodes] === code)?.[1] || 'UNKNOWN_STATUS';
    }
}