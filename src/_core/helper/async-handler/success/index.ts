import { NextFunction, Response } from 'express';
import { ReasonPhrases } from '../common/ReasonPhrases';
import { StatusCodes } from '../common/StatusCodes';

export interface ResponseOptions {
    code?: number;
    message?: string;
    metadata?: Record<string, any>;
    options?: Record<string, any>;
}

class SuccessResponse {
    success: boolean;
    message: string;
    status: number;
    metadata: any;
    options: any;
    data: any;

    constructor({
        message,
        statusCode = StatusCodes.OK,
        reasonPhrase = ReasonPhrases.OK,
        metadata = {},
        options = {},
        data = {},
    }: {
        message?: string;
        statusCode?: number;
        reasonPhrase?: string;
        metadata?: any;
        options?: any;
        data?: any;
    }) {
        this.success = true;
        this.message = message || reasonPhrase;
        this.status = statusCode;
        this.metadata = this.formatMetadata(metadata);
        this.options = options;
        this.data = data;
    }

    /**
     * Format Metadata
     */
    private formatMetadata(metadata: any) {
        return {
            timestamp: new Date().toISOString(),
            code: this.status,
            status: this.getStatusText(this.status),
            ...metadata,
        };
    }

    /**
     * Set Response Status Code
     */
    setStatus(status: number) {
        this.status = status;
        this.metadata.code = status;
        this.metadata.status = this.getStatusText(status);
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
                status: this.getStatusText(this.status),
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
     * Get Status Text
     */
    private getStatusText(code: number): string {
        return (
            Object.entries(ReasonPhrases).find(([_, value]) => StatusCodes[value as keyof typeof StatusCodes] === code)
                ?.[1] || 'UNKNOWN_STATUS'
        );
    }

    /**
     * Post-send Hooks
     */
    private postSendHooks() {
        // Example: Logging or clean-up operations
        console.log(`Response sent with status: ${this.status}`);
    }
}


class CreatedSuccess extends SuccessResponse {
	constructor({
        message,
        statusCode = StatusCodes.CREATED,
        reasonPhrase = ReasonPhrases.CREATED,
        metadata = {},
        options = {},
        data = {},
    }: {
        message?: string;
        statusCode?: number;
        reasonPhrase?: string;
        metadata?: any;
        options?: any;
        data?: any;
    }) {
        super({
            message,
            statusCode,
            reasonPhrase,
            metadata,
            options,
            data,
        });
    }
}
// class AcceptedSuccess extends SuccessResponse {
// 	constructor(result = ReasonPhrases.ACCEPTED as unknown, statusCode : string | number = StatusCodes.ACCEPTED) {
// 		super(result, statusCode);
// 	}
// }

// class NoContentSuccess extends SuccessResponse {
// 	constructor(result = ReasonPhrases.NO_CONTENT as unknown, statusCode : string | number = StatusCodes.NO_CONTENT) {
// 		super(result, statusCode);
// 	}
// }

// class ResetContentSuccess extends SuccessResponse {
// 	constructor(result = ReasonPhrases.RESET_CONTENT as unknown, statusCode : string | number = StatusCodes.RESET_CONTENT) {
// 		super(result, statusCode);
// 	}
// }

// class PartialContentSuccess extends SuccessResponse {
// 	constructor(result = ReasonPhrases.PARTIAL_CONTENT as unknown, statusCode : string | number = StatusCodes.PARTIAL_CONTENT) {
// 		super(result, statusCode);
// 	}
// }

// class NonAuthoritativeInformationSuccess extends SuccessResponse {
// 	constructor(result = ReasonPhrases.NON_AUTHORITATIVE_INFORMATION as unknown, statusCode : string | number = StatusCodes.NON_AUTHORITATIVE_INFORMATION) {
// 		super(result, statusCode);
// 	}
// }

// class MultiStatusSuccess extends SuccessResponse {
// 	constructor(result = ReasonPhrases.MULTI_STATUS as unknown, statusCode : string | number = StatusCodes.MULTI_STATUS) {
// 		super(result, statusCode);
// 	}
// }

// class SeeOtherSuccess extends SuccessResponse {
// 	constructor(result = ReasonPhrases.SEE_OTHER as unknown, statusCode : string | number = StatusCodes.SEE_OTHER) {
// 		super(result, statusCode);
// 	}
// }

// class ProcessingSuccess extends SuccessResponse {
// 	constructor(result = ReasonPhrases.PROCESSING as unknown, statusCode : string | number = StatusCodes.PROCESSING) {
// 		super(result, statusCode);
// 	}
// }

/**
 * Export Success Response
 */
const _SUCCESS = {
    SuccessResponse,
    CreatedSuccess, // 201
	// AcceptedSuccess, // 202
	// NoContentSuccess, // 204
	// ResetContentSuccess, // 205
	// PartialContentSuccess, // 206
	// NonAuthoritativeInformationSuccess, // 203
	// MultiStatusSuccess, // 207
	// SeeOtherSuccess, // 303
	// ProcessingSuccess // 102

};

export default _SUCCESS;
