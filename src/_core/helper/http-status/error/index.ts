import { NextFunction, Response } from 'express';
import { HttpStatusCode } from '../common/HttpStatusCode';
import { StatusCodes } from '../common/StatusCodes';
import { RestHandler } from '../common/RestHandler';

export class ErrorResponse {
    success: boolean;
    message: string;
    error?: any;
    status: HttpStatusCode;
    metadata: any;
    options: any;
    errors?: Array<{ field: string; message: string; code?: string }>;

    constructor({
        message,
        error = {},
        status = HttpStatusCode.INTERNAL_SERVER_ERROR,
        reasonPhrase = StatusCodes[status].phrase,
		errors,
        options = {},
    }: {
        message?: string;
        error?: any;
        status?: HttpStatusCode;
        reasonPhrase?: string;
        metadata?: any;
		errors?: Array<{ field: string; message: string; code?: string }>;
        options?: any;
    }) {
        this.success = false;
        this.message = message || reasonPhrase;
        this.error = error;
        this.status = status;
		this.errors = errors;
        this.metadata = this.formatMetadata(this.metadata);
        this.options = options;
    }

    private formatMetadata(metadata: any) {
        return {
            ...metadata,
        };
    }

    setStatus(status: number) {
        this.status = status;
        this.metadata.code = status;
        this.metadata.status = RestHandler.getStatusText(status);
        return this;
    }

    setMessage(message: string) {
        this.message = message;
        return this;
    }

    setMetadata(metadata: any) {
        this.metadata = { ...this.metadata, ...metadata };
        return this;
    }

    setOptions(options: any) {
        this.options = options;
        return this;
    }

    setResponseTime(startTime?: number) {
        const responseTime = startTime ? `${Date.now() - startTime}ms` : '0ms';
        this.metadata.responseTime = responseTime;
        return this;
    }

    setHeader(headers: Record<string, string>) {
        this.options.headers = { ...this.options.headers, ...headers };
        return this;
    }

    setError(error: any) {
        this.error = error;
        return this;
    }

    send(res: Response, next?: NextFunction) {
        try {
            this.preSendHooks();

            if (res.locals?.startTime) {
                this.setResponseTime(res.locals.startTime);
            }

            if (!res.headersSent) {
                const response = this.formatResponse();
                res.status(this.status).json(response);
            } else {
                console.warn('Attempted to send response after headers were already sent.');
            }

            this.postSendHooks();
        } catch (error) {
            console.error('Error sending response:', error);
            if (next) {
                next(error);
            } else {
                throw error;
            }
        }
    }

    private preSendHooks() {
        this.metadata.timestamp = new Date().toISOString();
    }

    private formatResponse() {
        const response = {
            success: this.success,
            message: this.message,
            error: this.error,
            metadata: {
                ...this.metadata,
                code: this.status,
                status: RestHandler.getStatusText(this.status),
            },
        };

        if (Object.keys(this.options).length > 0) {
            Object.assign(response, { options: this.options });
        }

        return response;
    }

    private postSendHooks() {
        console.error(`Error response sent with status: ${this.status}`);
    }
}

class BadRequestError extends ErrorResponse {
    constructor(params: any = {}) {
        super({
            ...params,
            status: params.status || HttpStatusCode.BAD_REQUEST,
        });
    }
}

class UnauthorizedError extends ErrorResponse {
    constructor(params: any = {}) {
        super({
            ...params,
            status: params.status || HttpStatusCode.UNAUTHORIZED,
        });
    }
}

class ForbiddenError extends ErrorResponse {
    constructor(params: any = {}) {
        super({
            ...params,
            status: params.status || HttpStatusCode.FORBIDDEN,
        });
    }
}

class NotFoundError extends ErrorResponse {
    constructor(params: any = {}) {
        super({
            ...params,
            status: params.status || HttpStatusCode.NOT_FOUND,
        });
    }
}

class ConflictError extends ErrorResponse {
    constructor(params: any = {}) {
        super({
            ...params,
            status: params.status || HttpStatusCode.CONFLICT,
        });
    }
}

class UnprocessableEntityError extends ErrorResponse {
    constructor(params: any = {}) {
        super({
            ...params,
            status: params.status || HttpStatusCode.UNPROCESSABLE_ENTITY,
        });
    }
}

class TooManyRequestsError extends ErrorResponse {
    constructor(params: any = {}) {
        super({
            ...params,
            status: params.status || HttpStatusCode.TOO_MANY_REQUESTS,
        });
    }
}

class InternalServerError extends ErrorResponse {
    constructor(params: any = {}) {
        super({
            ...params,
            status: params.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
        });
    }
}

const _ERROR = {
	ErrorResponse,
    BadRequestError, // 400
    UnauthorizedError, // 401
    ForbiddenError, // 403
    NotFoundError, // 404
    ConflictError, // 409
    UnprocessableEntityError, // 422
    TooManyRequestsError, // 429
    InternalServerError, // 500
};

export default _ERROR;