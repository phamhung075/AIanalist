import { HttpStatusCode } from "./../common/httpStatusCode"
const { StatusCodes, ReasonPhrases } = HttpStatusCode

export class SuccessResponse {
	status: number;
	message: string;
	constructor(message: string, status: number) {
		this.message = message;
		this.status = status;
	}
}

// List of success responses

class OkSuccess extends SuccessResponse {
	constructor(message = ReasonPhrases.OK, statusCode = StatusCodes.OK) {
		super(message, statusCode);
	}
}

class CreatedSuccess extends SuccessResponse {
	constructor(message = ReasonPhrases.CREATED, statusCode = StatusCodes.CREATED) {
		super(message, statusCode);
	}
}

class AcceptedSuccess extends SuccessResponse {
	constructor(message = ReasonPhrases.ACCEPTED, statusCode = StatusCodes.ACCEPTED) {
		super(message, statusCode);
	}
}

class NoContentSuccess extends SuccessResponse {
	constructor(message = ReasonPhrases.NO_CONTENT, statusCode = StatusCodes.NO_CONTENT) {
		super(message, statusCode);
	}
}

class ResetContentSuccess extends SuccessResponse {
	constructor(message = ReasonPhrases.RESET_CONTENT, statusCode = StatusCodes.RESET_CONTENT) {
		super(message, statusCode);
	}
}

class PartialContentSuccess extends SuccessResponse {
	constructor(message = ReasonPhrases.PARTIAL_CONTENT, statusCode = StatusCodes.PARTIAL_CONTENT) {
		super(message, statusCode);
	}
}

class NonAuthoritativeInformationSuccess extends SuccessResponse {
	constructor(message = ReasonPhrases.NON_AUTHORITATIVE_INFORMATION, statusCode = StatusCodes.NON_AUTHORITATIVE_INFORMATION) {
		super(message, statusCode);
	}
}

class MultiStatusSuccess extends SuccessResponse {
	constructor(message = ReasonPhrases.MULTI_STATUS, statusCode = StatusCodes.MULTI_STATUS) {
		super(message, statusCode);
	}
}

class SeeOtherSuccess extends SuccessResponse {
	constructor(message = ReasonPhrases.SEE_OTHER, statusCode = StatusCodes.SEE_OTHER) {
		super(message, statusCode);
	}
}

class ProcessingSuccess extends SuccessResponse {
	constructor(message = ReasonPhrases.PROCESSING, statusCode = StatusCodes.PROCESSING) {
		super(message, statusCode);
	}
}

const _SUCCESS = {
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

export { _SUCCESS };
