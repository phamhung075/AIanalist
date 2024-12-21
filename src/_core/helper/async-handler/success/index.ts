import { HttpStatusCode } from "../common/HttpStatusCode"
const { StatusCodes, ReasonPhrases } = HttpStatusCode

class SuccessResponse {
	message: string;
	status: number;
	metadata: any;
	options: any;
	data: any;
	constructor({ message, statusCode = StatusCodes.OK, reasonPhrase = ReasonPhrases.OK, metadata = {}, options = {}, data ={} }: { message?: string; statusCode?: number; reasonPhrase?: string; metadata?: any, options?: any, data?: any }) {
		this.message = !message ? reasonPhrase : message;
		this.status = statusCode;
		this.metadata = metadata;
		this.options = options;
		this.data = data;
	}

	send(res: any, _header: any = {}) {
		return res.status(this.status).json(this);
	}
}

// Specific classes for each type of successful response
class OKResponse extends SuccessResponse { // 200
	constructor({ message, metadata }: { message?: string; metadata?: any }) {
		super({ message, metadata });
	}
}

class CreatedResponse extends SuccessResponse { // 201
	options: any;

	constructor({ options = {}, message, statusCode = StatusCodes.CREATED, reasonPhrase = ReasonPhrases.CREATED, metadata }: { options?: any; message?: string; statusCode?: number; reasonPhrase?: string; metadata?: any }) {
		super({ message, statusCode, reasonPhrase, metadata });
		this.options = options;
	}
}

class AcceptedResponse extends SuccessResponse { // 202
	constructor({ options = {}, message, statusCode = StatusCodes.ACCEPTED, reasonPhrase = ReasonPhrases.ACCEPTED, metadata }: { options?: any; message?: string; statusCode?: number; reasonPhrase?: string; metadata?: any }) {
		super({ message, statusCode, reasonPhrase, metadata });
		this.options = options;
	}
}

class NonAuthoritativeInformationResponse extends SuccessResponse { // 203
	constructor({ options = {}, message, statusCode = StatusCodes.NON_AUTHORITATIVE_INFORMATION, reasonPhrase = ReasonPhrases.NON_AUTHORITATIVE_INFORMATION, metadata }: { options?: any; message?: string; statusCode?: number; reasonPhrase?: string; metadata?: any }) {
		super({ message, statusCode, reasonPhrase, metadata });
		this.options = options;
	}
}

class NoContentResponse extends SuccessResponse { // 204
	constructor({ message, statusCode = StatusCodes.NO_CONTENT, reasonPhrase = ReasonPhrases.NO_CONTENT, metadata = null }: { message?: string; statusCode?: number; reasonPhrase?: string; metadata?: any }) {
		super({ message, statusCode, reasonPhrase, metadata });
	}
}

class ResetContentResponse extends SuccessResponse { // 205
	constructor({ message, statusCode = StatusCodes.RESET_CONTENT, reasonPhrase = ReasonPhrases.RESET_CONTENT, metadata }: { message?: string; statusCode?: number; reasonPhrase?: string; metadata?: any }) {
		super({ message, statusCode, reasonPhrase, metadata });
	}
}

class PartialContentResponse extends SuccessResponse { // 206
	constructor({ options = {}, message, statusCode = StatusCodes.PARTIAL_CONTENT, reasonPhrase = ReasonPhrases.PARTIAL_CONTENT, metadata }: { options?: any; message?: string; statusCode?: number; reasonPhrase?: string; metadata?: any }) {
		super({ message, statusCode, reasonPhrase, metadata });
		this.options = options;

	}
}

class MultiStatusResponse extends SuccessResponse { // 207
	constructor({ message, statusCode = StatusCodes.MULTI_STATUS, reasonPhrase = ReasonPhrases.MULTI_STATUS, metadata }: { message?: string; statusCode?: number; reasonPhrase?: string; metadata?: any }) {
		super({ message, statusCode, reasonPhrase, metadata });
	}
}

class AlreadyReportedResponse extends SuccessResponse { // 208
	constructor({ message, statusCode = StatusCodes.ALREADY_REPORTED, reasonPhrase = ReasonPhrases.ALREADY_REPORTED, metadata }: { message?: string; statusCode?: number; reasonPhrase?: string; metadata?: any }) {
		super({ message, statusCode, reasonPhrase, metadata });
	}
}

class IMUsedResponse extends SuccessResponse { // 226
	constructor({ options = {}, message, statusCode = StatusCodes.IM_USED, reasonPhrase = ReasonPhrases.IM_USED, metadata }: { options?: any; message?: string; statusCode?: number; reasonPhrase?: string; metadata?: any }) {
		super({ message, statusCode, reasonPhrase, metadata });
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

export  {_SUCCESS, SuccessResponse};
