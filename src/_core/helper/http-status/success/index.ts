import { NextFunction, Response } from 'express';
import { HttpStatusCode } from '../common/HttpStatusCode';
import { StatusCodes } from '../common/StatusCodes';

export interface ResponseOptions {
    code?: number;
    message?: string;
    metadata?: Record<string, any>;
    options?: Record<string, any>;
}

interface StatusCodeDetails {
    code: HttpStatusCode;
    phrase: string;
    description: string;
    documentation: string;
}

interface StatusCodesType {
    [key: number]: StatusCodeDetails;
}

class SuccessResponse {
    message: string;
    data: any;
    status: HttpStatusCode;
    metadata: any;
    options: any;

    constructor({
        message,
        data = {},
        status = HttpStatusCode.OK,
        reasonPhrase = (StatusCodes as StatusCodesType)[status].phrase,
        options = {},
    }: {
        message?: string;
        data?: any;
        status?: HttpStatusCode;
        reasonPhrase?: string;
        metadata?: any;
        options?: any;
    }) {
        this.message = message || reasonPhrase;
        this.data = data;
        this.status = status;
        this.options = options;
    }

    /**
     * Set Response Message
     */
    setMessage(message: string) {
        this.message = message;
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
     * Set Custom Headers
     */
    setHeader(headers: Record<string, string>) {
        this.options.headers = { ...this.options.headers, ...headers };
        return this;
    }

    /**
     * Send Response
     */
    send(res: Response, next?: NextFunction) {
        try {
            this.preSendHooks();
          
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
            message: this.message,
            data: this.data,
            metadata: {
                ...this.metadata,
            },
        };

        if (Object.keys(this.options).length > 0) {
            Object.assign(response, { options: this.options });
        }

        return response;
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
