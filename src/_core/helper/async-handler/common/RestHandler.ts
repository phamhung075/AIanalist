// src/_core/utils/response.handler.ts
import { Response } from 'express';
import { HttpStatusCode } from './HttpStatusCode';
import { RestResponse } from '../../interfaces/rest.interface';
const { StatusCodes, ReasonPhrases } = HttpStatusCode;

export class RestHandler {
    static success<T>(res: Response, {
        data,
        code = StatusCodes.OK,
        message = ReasonPhrases.OK,
        pagination,
        links,
        startTime
    }: {
        data: T;
        code?: number;
        message?: string;
        pagination?: RestResponse['metadata']['pagination'];
        links?: RestResponse['metadata']['links'];
        startTime: number;
    }): Response {
        const responseTime = (new Date().getTime() - startTime).toString();
        const response: RestResponse<T> = {
            level: "Success REST",
            data,
            metadata: {
                code,
                status: this.getStatusText(code),
                message,
                timestamp: new Date().toISOString(),
                ...(pagination && { pagination }),
                ...(links && { links }),
                responseTime
            },
        };
        console.log(response);
        return res.status(code).json(response);
    }

    static error(res: Response, {
        errors,
        code = StatusCodes.INTERNAL_SERVER_ERROR,
        message = ReasonPhrases.INTERNAL_SERVER_ERROR
    }: {
        errors: RestResponse['errors'];
        code?: number;
        message?: string;
    }): Response {

        const response: RestResponse = {
            level: "Error REST",
            data: null,
            metadata: {
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
        return Object.entries(StatusCodes)
            .find(([_, value]) => value === code)?.[0] || 'UNKNOWN_STATUS';
    }
}