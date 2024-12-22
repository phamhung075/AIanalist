import { NextFunction } from "@node_modules/@types/express";
import { ReasonPhrases } from "../common/ReasonPhrases";
import { StatusCodes } from "../common/StatusCodes";

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
        data = {}
    }: {
        message?: string;
        statusCode?: number;
        reasonPhrase?: string;
        metadata?: any,
        options?: any,
        data?: any
    }) {
        this.success = true;
        this.message = !message ? reasonPhrase : message;
        this.status = statusCode;
        this.metadata = this.formatMetadata(metadata);
        this.options = options;
        this.data = data;
    }

    private formatMetadata(metadata: any) {
        return {
            timestamp: new Date().toISOString(),
            code: this.status,
            status: this.getStatusText(this.status),
            ...metadata
        };
    }  

    setStatus(status: number) {
        this.status = status;
        this.metadata.code = status;
        this.metadata.status = this.getStatusText(status);
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
        if (!startTime) {
            this.metadata.responseTime = '0ms';
        } else {
            const responseTime = `${Date.now() - startTime}ms`;
            this.metadata.responseTime = responseTime;
        }
        return this;
    }

 
    setData(data: any) {
        this.data = data;
        return this;
    }

    send(res: any, next?: NextFunction) {
        try {
            // 1. Pre-send hooks
            this.preSendHooks();
    
            // 2. Set response time once
            if (res.startTime) {
                this.setResponseTime(res.startTime);
            }
    
            // 3. Format response
            const response = this.formatResponse();
    
            // 4. Handle headers
            this.handleHeaders(res);
    
            // 5. Send response
            if (!res.headersSent) {
                return res.status(this.status).json(response);
            }
    
            // 6. Post-send hooks (if needed)
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
        // Add any pre-send logic
        // Example: logging, validation, etc.
        this.metadata.timestamp = new Date().toISOString();
    }

    private formatResponse() {
        const response = {
            success: this.success,
            message: this.message,
            data: this.data,
            metadata: {
                ...this.metadata,
                code: this.status,
                status: this.getStatusText(this.status)
            }
        };

        // Only include options if they exist
        if (Object.keys(this.options).length > 0) {
            Object.assign(response, { options: this.options });
        }

        return response;
    }

    private handleHeaders(res: any) {
        // Set standard headers
        res.set('X-Response-Time', this.metadata.responseTime);
        
        // Set custom headers if they exist
        if (this.options?.headers) {
            Object.entries(this.options.headers).forEach(([key, value]) => {
                res.set(key, value);
            });
        }
    }

    

    private getStatusText(code: number): string {
        return Object.entries(ReasonPhrases)
            .find(([_, value]) => StatusCodes[value as keyof typeof StatusCodes] === code)?.[1] 
            || 'UNKNOWN_STATUS';
    }

    private postSendHooks() {
        // Add any post-send logic
        // Example: cleanup, logging, etc.
    }
}


const _SUCCESS = {
    SuccessResponse
}

export default _SUCCESS;