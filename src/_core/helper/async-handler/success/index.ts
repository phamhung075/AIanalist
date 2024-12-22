import { MetaData } from "../../interfaces/rest.interface";
import { HttpStatusCode } from "../common/HttpStatusCode"
const { StatusCodes, ReasonPhrases } = HttpStatusCode
class SuccessResponse {
    success: boolean;
    message: string;
    status: number;
    metadata: MetaData;
    data: any;
    options?: Record<string, any>;

    constructor({
        message,
        statusCode = StatusCodes.OK,
        reasonPhrase = ReasonPhrases.OK,
        metadata = {},
        options = {},
        data = {},
        req
    }: {
        message?: string;
        statusCode?: number;
        reasonPhrase?: string;
        metadata?: Partial<MetaData>;
        options?: Record<string, any>;
        data?: any;
        req?: any;
    }) {
        const baseUrl = req ? `${req.protocol}://${req.get('host')}` : '';
        const requestPath = req ? req.originalUrl : '';

        this.success = true;
        this.message = !message ? reasonPhrase : message;
        this.status = statusCode;
        this.data = data;
        this.options = Object.keys(options).length > 0 ? options : undefined;

        // Construct metadata
        this.metadata = {
            timestamp: new Date().toISOString(),
            code: statusCode,
            status: reasonPhrase,
            ...(req && {
                path: requestPath,
                request: {
                    id: `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,                    
					timestamp: new Date().toISOString(),
                    method: req.method,
                    url: `${baseUrl}${requestPath}`
                }
            }),
            ...metadata
        };
    }

    send(res: any, headers: Record<string, any> = {}) {
        // Add response time to metadata
        this.metadata.responseTime = `${Date.now() - new Date(this.metadata.timestamp).getTime()}ms`;
        
        // Set any custom headers
        Object.entries(headers).forEach(([key, value]) => {
            res.set(key, value);
        });

        return res.status(this.status).json({
            success: this.success,
            message: this.message,
            data: this.data,
            metadata: this.metadata,
            ...(this.options && { options: this.options })
        });
    }
}
// Specific classes for each type of successful response
class OKResponse extends SuccessResponse { // 200
	constructor({ message, data }: { message?: string; data?: any }) {
		super({ message, data });
	}
}

class CreatedResponse extends SuccessResponse {
    constructor({ 
        message, 
        data,
        metadata = {},
        options = {},
        req
    }: { 
        message?: string; 
        data?: any;
        metadata?: Partial<MetaData>;
        options?: Record<string, any>;
        req?: any;
    }) {
        super({ 
            message, 
            statusCode: StatusCodes.CREATED, 
            reasonPhrase: ReasonPhrases.CREATED,
            data,
            metadata,
            options,
            req
        });
    }
}

class AcceptedResponse extends SuccessResponse { // 202
	constructor({ options = {}, message, statusCode = StatusCodes.ACCEPTED, reasonPhrase = ReasonPhrases.ACCEPTED, data }: { options?: any; message?: string; statusCode?: number; reasonPhrase?: string; data?: any }) {
		super({ message, statusCode, reasonPhrase, data });
		this.options = options;
	}
}

class NonAuthoritativeInformationResponse extends SuccessResponse { // 203
	constructor({ options = {}, message, statusCode = StatusCodes.NON_AUTHORITATIVE_INFORMATION, reasonPhrase = ReasonPhrases.NON_AUTHORITATIVE_INFORMATION, data }: { options?: any; message?: string; statusCode?: number; reasonPhrase?: string; data?: any }) {
		super({ message, statusCode, reasonPhrase, data });
		this.options = options;
	}
}

class NoContentResponse extends SuccessResponse { // 204
	constructor({ message, statusCode = StatusCodes.NO_CONTENT, reasonPhrase = ReasonPhrases.NO_CONTENT, data = null }: { message?: string; statusCode?: number; reasonPhrase?: string; data?: any }) {
		super({ message, statusCode, reasonPhrase, data });
	}
}

class ResetContentResponse extends SuccessResponse { // 205
	constructor({ message, statusCode = StatusCodes.RESET_CONTENT, reasonPhrase = ReasonPhrases.RESET_CONTENT, data }: { message?: string; statusCode?: number; reasonPhrase?: string; data?: any }) {
		super({ message, statusCode, reasonPhrase, data });
	}
}

class PartialContentResponse extends SuccessResponse { // 206
	constructor({ options = {}, message, statusCode = StatusCodes.PARTIAL_CONTENT, reasonPhrase = ReasonPhrases.PARTIAL_CONTENT, data }: { options?: any; message?: string; statusCode?: number; reasonPhrase?: string; data?: any }) {
		super({ message, statusCode, reasonPhrase, data });
		this.options = options;

	}
}

class MultiStatusResponse extends SuccessResponse { // 207
	constructor({ message, statusCode = StatusCodes.MULTI_STATUS, reasonPhrase = ReasonPhrases.MULTI_STATUS, data }: { message?: string; statusCode?: number; reasonPhrase?: string; data?: any }) {
		super({ message, statusCode, reasonPhrase, data });
	}
}

class AlreadyReportedResponse extends SuccessResponse { // 208
	constructor({ message, statusCode = StatusCodes.ALREADY_REPORTED, reasonPhrase = ReasonPhrases.ALREADY_REPORTED, data }: { message?: string; statusCode?: number; reasonPhrase?: string; data?: any }) {
		super({ message, statusCode, reasonPhrase, data });
	}
}

class IMUsedResponse extends SuccessResponse { // 226
	constructor({ options = {}, message, statusCode = StatusCodes.IM_USED, reasonPhrase = ReasonPhrases.IM_USED, data }: { options?: any; message?: string; statusCode?: number; reasonPhrase?: string; data?: any }) {
		super({ message, statusCode, reasonPhrase, data });
		this.options = options;

	}
}

// Exporting the responses in order of increasing status codes
const _SUCCESS = {
	OKResponse, // 200
	CreatedResponse, // 201
	AcceptedResponse, // 202
	NonAuthoritativeInformationResponse, // 203
	NoContentResponse, // 204
	ResetContentResponse, // 205
	PartialContentResponse, // 206
	MultiStatusResponse, // 207
	AlreadyReportedResponse, // 208
	IMUsedResponse, // 226
	SuccessResponse
};

export { _SUCCESS, SuccessResponse };
