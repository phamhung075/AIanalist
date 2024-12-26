import { NextFunction, Response } from 'express';
import { HttpStatusCode } from '../common/HttpStatusCode';
import { StatusCodes } from '../common/StatusCodes';
import { RestHandler } from '../common/RestHandler';


class SuccessResponse {
    success: boolean;
    message: string;
    data: any;
    status: HttpStatusCode;
    metadata: any;
    options: any;

    constructor({
        message,
        data = {},
        status = HttpStatusCode.OK,
        reasonPhrase = StatusCodes[status].phrase,
        options = {},
    }: {
        message?: string;
        data?: any;
        status?: HttpStatusCode;
        reasonPhrase?: string;
        metadata?: any;
        options?: any;
    }) {
        this.success = true;
        this.message = message || reasonPhrase;
        this.data = data;
        this.status = status;
        this.metadata = this.formatMetadata(this.metadata);
        this.options = options;
    }

    /**
     * Format Metadata
     */
    private formatMetadata(metadata: any) {
        return {
            ...metadata,
        };
    }

    /**
     * Set Response Status Code
     */
    setStatus(status: number) {
        this.status = status;
        this.metadata.code = status;
        this.metadata.status = RestHandler.getStatusText(status);
        return this;
    }

    /**
     * Set Response Message
     */
    setMessage(message: string) {
        this.message = message;
        return this;
    }

    /**
     * Set Metadata
     */
    setMetadata(metadata: any) {
        this.metadata = { ...this.metadata, ...metadata };
        return this;
    }

    /**
     * Set Options
     */
    setOptions(options: any) {
        this.options = options;
        return this;
    }

    /**
     * Set Response Time
     */
    setResponseTime(startTime?: number) {
        const responseTime = startTime ? `${Date.now() - startTime}ms` : '0ms';
        this.metadata.responseTime = responseTime;
        return this;
    }

    /**
     * Set Custom Headers
     */
    setHeader(headers: Record<string, string>) {
        this.options.headers = { ...this.options.headers, ...headers };
        return this;
    }

    /**
     * Set Response Data
     */
    setData(data: any) {
        this.data = data;
        return this;
    }

    /**
     * Send Response
     */
    send(res: Response, next?: NextFunction) {
        try {
            this.preSendHooks();

            // Set Response Time if startTime exists on res.locals
            if (res.locals?.startTime) {
                this.setResponseTime(res.locals.startTime);
            }

            // Handle Headers
            this.handleHeaders(res);

            // Send Response
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

    /**
     * Pre-send Hooks
     */
    private preSendHooks() {
        this.metadata.timestamp = new Date().toISOString();
    }

    /**
     * Format Response
     */
    private formatResponse() {
        const response = {
            success: this.success,
            message: this.message,
            data: this.data,
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

    /**
     * Handle Headers
     */
    private handleHeaders(res: Response) {
        if (this.options?.headers) {
            Object.entries(this.options.headers).forEach(([key, value]) => {
                // Ensure value is converted to a valid header type
                const safeValue = Array.isArray(value)
                    ? value.map(v => String(v))
                    : String(value);
                res.setHeader(key, safeValue);
            });
        }
    
        res.setHeader('X-Response-Time', this.metadata.responseTime);
    }
  

    /**
     * Post-send Hooks
     */
    private postSendHooks() {
        // Example: Logging or clean-up operations
        console.log(`Response sent with status: ${this.status}`);
    }
}

class OkSuccess extends SuccessResponse {
	constructor({
        message,
        status,
        metadata = {},
        options = {},
        data = {},
    }: {
        message?: string;
        status?: HttpStatusCode;
        metadata?: any;
        options?: any;
        data?: any;
    }) {
        super({
            message,
            data,
            status : status || HttpStatusCode.OK,
            metadata,
            options,
        });
    }
}

class CreatedSuccess extends SuccessResponse {
	constructor({
        message,
        status,
        metadata = {},
        options = {},
        data = {},
    }: {
        message?: string;
        status?: HttpStatusCode;
        metadata?: any;
        options?: any;
        data?: any;
    }) {
        super({
            message,
            data,
            status : status || HttpStatusCode.CREATED,
            metadata,
            options,
        });
    }
}


class AcceptedSuccess extends SuccessResponse {
	constructor({
        message,
        status,
        metadata = {},
        options = {},
        data = {},
    }: {
        message?: string;
        status?: HttpStatusCode;
        metadata?: any;
        options?: any;
        data?: any;
    }) {
        super({
            message,
            data,
            status : status || HttpStatusCode.ACCEPTED,
            metadata,
            options,
        });
    }
}
class NoContentSuccess extends SuccessResponse {
	constructor({
        message,
        status,
        metadata = {},
        options = {},
        data = {},
    }: {
        message?: string;
        status?: HttpStatusCode;
        metadata?: any;
        options?: any;
        data?: any;
    }) {
        super({
            message,
            data,
            status : status || HttpStatusCode.NO_CONTENT,
            metadata,
            options,
        });
    }
}

class ResetContentSuccess extends SuccessResponse {
	constructor({
        message,
        status,
        metadata = {},
        options = {},
        data = {},
    }: {
        message?: string;
        status?: HttpStatusCode;
        metadata?: any;
        options?: any;
        data?: any;
    }) {
        super({
            message,
            data,
            status : status || HttpStatusCode.RESET_CONTENT,
            metadata,
            options,
        });
    }
}

class PartialContentSuccess extends SuccessResponse {
	constructor({
        message,
        status,
        metadata = {},
        options = {},
        data = {},
    }: {
        message?: string;
        status?: HttpStatusCode;
        metadata?: any;
        options?: any;
        data?: any;
    }) {
        super({
            message,
            data,
            status : status || HttpStatusCode.PARTIAL_CONTENT,
            metadata,
            options,
        });
    }
}

class NonAuthoritativeInformationSuccess extends SuccessResponse {
	constructor({
        message,
        status,
        metadata = {},
        options = {},
        data = {},
    }: {
        message?: string;
        status?: HttpStatusCode;
        metadata?: any;
        options?: any;
        data?: any;
    }) {
        super({
            message,
            data,
            status : status || HttpStatusCode.NON_AUTHORITATIVE_INFORMATION,
            metadata,
            options,
        });
    }
}
class MultiStatusSuccess extends SuccessResponse {
	constructor({
        message,
        status,
        metadata = {},
        options = {},
        data = {},
    }: {
        message?: string;
        status?: HttpStatusCode;
        metadata?: any;
        options?: any;
        data?: any;
    }) {
        super({
            message,
            data,
            status : status || HttpStatusCode.MULTI_STATUS,
            metadata,
            options,
        });
    }
}
class SeeOtherSuccess extends SuccessResponse {
	constructor({
        message,
        status,
        metadata = {},
        options = {},
        data = {},
    }: {
        message?: string;
        status?: HttpStatusCode;
        metadata?: any;
        options?: any;
        data?: any;
    }) {
        super({
            message,
            data,
            status : status || HttpStatusCode.SEE_OTHER,
            metadata,
            options,
        });
    }
}

class ProcessingSuccess extends SuccessResponse {
	constructor({
        message,
        status,
        metadata = {},
        options = {},
        data = {},
    }: {
        message?: string;
        status?: HttpStatusCode;
        metadata?: any;
        options?: any;
        data?: any;
    }) {
        super({
            message,
            data,
            status : status || HttpStatusCode.PROCESSING,
            metadata,
            options,
        });
    }
}

/**
 * Export Success Response
 */
const _SUCCESS = {
    SuccessResponse,
    OkSuccess, // 200
    CreatedSuccess, // 201
	AcceptedSuccess, // 202
	NoContentSuccess, // 204
	ResetContentSuccess, // 205
	PartialContentSuccess, // 206
	NonAuthoritativeInformationSuccess, // 203
	MultiStatusSuccess, // 207
	SeeOtherSuccess, // 303
	ProcessingSuccess // 102

};

export default _SUCCESS;