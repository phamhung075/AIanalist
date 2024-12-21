
import { HttpStatusCode } from "./../common/httpStatusCode"
const { StatusCodes, ReasonPhrases } = HttpStatusCode
// Interface for standardized error response
export interface ErrorDetails {
    code: string;
    message: string;
    field?: string;
}


// // List error handle

// class BadRequestError extends ErrorResponse {
// 	constructor(message = ReasonPhrases.BAD_REQUEST, statusCode = StatusCodes.BAD_REQUEST) {
// 		super(message, statusCode);
// 	}
// }

// class UnauthorizedError extends ErrorResponse {
// 	constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED) {
// 		super(message, statusCode);
// 	}
// }

// class PaymentRequiredError extends ErrorResponse {
// 	constructor(message = ReasonPhrases.PAYMENT_REQUIRED, statusCode = StatusCodes.PAYMENT_REQUIRED) {
// 		super(message, statusCode);
// 	}
// }

// class ForbiddenError extends ErrorResponse {
// 	constructor(message = ReasonPhrases.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN) {
// 		super(message, statusCode);
// 	}
// }

// class NotFoundError extends ErrorResponse {
// 	constructor(message = ReasonPhrases.NOT_FOUND, statusCode = StatusCodes.NOT_FOUND) {
// 		super(message, statusCode);
// 	}
// }

// class MethodNotAllowedError extends ErrorResponse {
// 	constructor(message = ReasonPhrases.METHOD_NOT_ALLOWED, statusCode = StatusCodes.METHOD_NOT_ALLOWED) {
// 		super(message, statusCode);
// 	}
// }

// class NotAcceptableError extends ErrorResponse {
// 	constructor(message = ReasonPhrases.NOT_ACCEPTABLE, statusCode = StatusCodes.NOT_ACCEPTABLE) {
// 		super(message, statusCode);
// 	}
// }

// class ProxyAuthenticationRequiredError extends ErrorResponse {
// 	constructor(message = ReasonPhrases.PROXY_AUTHENTICATION_REQUIRED, statusCode = StatusCodes.PROXY_AUTHENTICATION_REQUIRED) {
// 		super(message, statusCode);
// 	}
// }

// class RequestTimeoutError extends ErrorResponse {
// 	constructor(message = ReasonPhrases.REQUEST_TIMEOUT, statusCode = StatusCodes.REQUEST_TIMEOUT) {
// 		super(message, statusCode);
// 	}
// }

// class ConflictRequestError extends ErrorResponse {
// 	constructor(message = ReasonPhrases.CONFLICT, statusCode = StatusCodes.CONFLICT) {
// 		super(message, statusCode);
// 	}
// }

// class GoneError extends ErrorResponse {
// 	constructor(message = ReasonPhrases.GONE, statusCode = StatusCodes.GONE) {
// 		super(message, statusCode);
// 	}
// }

// class LengthRequiredError extends ErrorResponse {
// 	constructor(message = ReasonPhrases.LENGTH_REQUIRED, statusCode = StatusCodes.LENGTH_REQUIRED) {
// 		super(message, statusCode);
// 	}
// }

// class PreconditionFailedError extends ErrorResponse {
// 	constructor(message = ReasonPhrases.PRECONDITION_FAILED, statusCode = StatusCodes.PRECONDITION_FAILED) {
// 		super(message, statusCode);
// 	}
// }

// class RequestTooLongError extends ErrorResponse {
// 	constructor(message = ReasonPhrases.REQUEST_TOO_LONG, statusCode = StatusCodes.REQUEST_TOO_LONG) {
// 		super(message, statusCode);
// 	}
// }

// class RequestUriTooLongError extends ErrorResponse {
// 	constructor(message = ReasonPhrases.REQUEST_URI_TOO_LONG, statusCode = StatusCodes.REQUEST_URI_TOO_LONG) {
// 		super(message, statusCode);
// 	}
// }

// class UnsupportedMediaTypeError extends ErrorResponse {
// 	constructor(message = ReasonPhrases.UNSUPPORTED_MEDIA_TYPE, statusCode = StatusCodes.UNSUPPORTED_MEDIA_TYPE) {
// 		super(message, statusCode);
// 	}
// }

// class RequestedRangeNotSatisfiableError extends ErrorResponse {
// 	constructor(message = ReasonPhrases.REQUESTED_RANGE_NOT_SATISFIABLE, statusCode = StatusCodes.REQUESTED_RANGE_NOT_SATISFIABLE) {
// 		super(message, statusCode);
// 	}
// }

// class ExpectationFailedError extends ErrorResponse {
// 	constructor(message = ReasonPhrases.EXPECTATION_FAILED, statusCode = StatusCodes.EXPECTATION_FAILED) {
// 		super(message, statusCode);
// 	}
// }

// class ImATeapotError extends ErrorResponse {
// 	constructor(message = ReasonPhrases.IM_A_TEAPOT, statusCode = StatusCodes.IM_A_TEAPOT) {
// 		super(message, statusCode);
// 	}
// }

// class InsufficientStorageError extends ErrorResponse {
// 	constructor(message = ReasonPhrases.INSUFFICIENT_SPACE_ON_RESOURCE, statusCode = StatusCodes.INSUFFICIENT_SPACE_ON_RESOURCE) {
// 		super(message, statusCode);
// 	}
// }

// class MethodFailureError extends ErrorResponse {
// 	constructor(message = ReasonPhrases.METHOD_FAILURE, statusCode = StatusCodes.METHOD_FAILURE) {
// 		super(message, statusCode);
// 	}
// }

// class MisdirectedRequestError extends ErrorResponse {
// 	constructor(message = ReasonPhrases.MISDIRECTED_REQUEST, statusCode = StatusCodes.MISDIRECTED_REQUEST) {
// 		super(message, statusCode);
// 	}
// }

// class UnprocessableEntityError extends ErrorResponse {
// 	constructor(message = ReasonPhrases.UNPROCESSABLE_ENTITY, statusCode = StatusCodes.UNPROCESSABLE_ENTITY) {
// 		super(message, statusCode);
// 	}
// }

// class LockedError extends ErrorResponse {
// 	constructor(message = ReasonPhrases.LOCKED, statusCode = StatusCodes.LOCKED) {
// 		super(message, statusCode);
// 	}
// }

// class FailedDependencyError extends ErrorResponse {
// 	constructor(message = ReasonPhrases.FAILED_DEPENDENCY, statusCode = StatusCodes.FAILED_DEPENDENCY) {
// 		super(message, statusCode);
// 	}
// }

// class PreconditionRequiredError extends ErrorResponse {
// 	constructor(message = ReasonPhrases.PRECONDITION_REQUIRED, statusCode = StatusCodes.PRECONDITION_REQUIRED) {
// 		super(message, statusCode);
// 	}
// }

// class TooManyRequestsError extends ErrorResponse {
// 	constructor(message = ReasonPhrases.TOO_MANY_REQUESTS, statusCode = StatusCodes.TOO_MANY_REQUESTS) {
// 		super(message, statusCode);
// 	}
// }

// class RequestHeaderFieldsTooLargeError extends ErrorResponse {
// 	constructor(message = ReasonPhrases.REQUEST_HEADER_FIELDS_TOO_LARGE, statusCode = StatusCodes.REQUEST_HEADER_FIELDS_TOO_LARGE) {
// 		super(message, statusCode);
// 	}
// }

// class UnavailableForLegalReasonsError extends ErrorResponse {
// 	constructor(message = ReasonPhrases.UNAVAILABLE_FOR_LEGAL_REASONS, statusCode = StatusCodes.UNAVAILABLE_FOR_LEGAL_REASONS) {
// 		super(message, statusCode);
// 	}
// }

// class InternalServerError extends ErrorResponse {
// 	constructor(message = ReasonPhrases.INTERNAL_SERVER_ERROR, statusCode = StatusCodes.INTERNAL_SERVER_ERROR) {
// 		super(message, statusCode);
// 	}
// }

// class NotImplementedError extends ErrorResponse {
// 	constructor(message = ReasonPhrases.NOT_IMPLEMENTED, statusCode = StatusCodes.NOT_IMPLEMENTED) {
// 		super(message, statusCode);
// 	}
// }

// class BadGatewayError extends ErrorResponse {
// 	constructor(message = ReasonPhrases.BAD_GATEWAY, statusCode = StatusCodes.BAD_GATEWAY) {
// 		super(message, statusCode);
// 	}
// }

// class ServiceUnavailableError extends ErrorResponse {
// 	constructor(message = ReasonPhrases.SERVICE_UNAVAILABLE, statusCode = StatusCodes.SERVICE_UNAVAILABLE) {
// 		super(message, statusCode);
// 	}
// }

// class GatewayTimeoutError extends ErrorResponse {
// 	constructor(message = ReasonPhrases.GATEWAY_TIMEOUT, statusCode = StatusCodes.GATEWAY_TIMEOUT) {
// 		super(message, statusCode);
// 	}
// }

// class HttpVersionNotSupportedError extends ErrorResponse {
// 	constructor(message = ReasonPhrases.HTTP_VERSION_NOT_SUPPORTED, statusCode = StatusCodes.HTTP_VERSION_NOT_SUPPORTED) {
// 		super(message, statusCode);
// 	}
// }


// class NetworkAuthenticationRequiredError extends ErrorResponse {
// 	constructor(message = ReasonPhrases.NETWORK_AUTHENTICATION_REQUIRED, statusCode = StatusCodes.NETWORK_AUTHENTICATION_REQUIRED) {
// 		super(message, statusCode);
// 	}
// }

// src/_core/helper/async-handler/error/error.response.ts
// src/_core/types/error.types.ts
export class ErrorResponse extends Error {
    status: number;
    code: string;
    field?: string;
    details?: any;
    errors?: Array<{ 
        field: string; 
        message: string;
        code?: string;
        details?: any;
    }>;

    constructor({
        message,
        status,
        code,
        field,
        details,
        errors
    }: {
        message: string;
        status: number;
        code: string;
        field?: string;
        details?: any;
        errors?: Array<{ 
            field: string; 
            message: string;
            code?: string;
        }>;
    }) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        this.code = code;
        this.field = field;
        this.details = details;
        this.errors = errors;
    }
}

class BadRequestError extends ErrorResponse {
    constructor(data: {
        message?: string;
        field?: string;
        errors?: Array<{ field: string; message: string; code?: string }>;
    }) {
        super({
            message: data.message || ReasonPhrases.BAD_REQUEST,
            status: StatusCodes.BAD_REQUEST,
            code: 'BAD_REQUEST',
            field: data.field,
            errors: data.errors
        });
    }
}

// Same pattern for other error classes
class UnprocessableEntityError extends ErrorResponse {
    constructor(data: {
        message?: string;
        field?: string;
        errors?: Array<{ field: string; message: string; code?: string }>;
    }) {
        super({
            message: data.message || ReasonPhrases.UNPROCESSABLE_ENTITY,
            status: StatusCodes.UNPROCESSABLE_ENTITY,
            code: 'UNPROCESSABLE_ENTITY',
            field: data.field,
            errors: data.errors
        });
    }
}

// Thêm các lớp lỗi khác theo nhu cầu...

const _ERROR = {
	BadRequestError, // 400
	// UnauthorizedError, // 401
	// PaymentRequiredError, // 402
	// ForbiddenError, // 403
	// NotFoundError, // 404
	// MethodNotAllowedError, // 405
	// NotAcceptableError, // 406
	// ProxyAuthenticationRequiredError, // 407
	// RequestTimeoutError, // 408
	// ConflictRequestError, // 409
	// GoneError, // 410
	// LengthRequiredError, // 411
	// PreconditionFailedError, // 412
	// RequestTooLongError, // 413
	// RequestUriTooLongError, // 414
	// UnsupportedMediaTypeError, // 415
	// RequestedRangeNotSatisfiableError, // 416
	// ExpectationFailedError, // 417
	// ImATeapotError, // 418
	// InsufficientStorageError, // 419
	// MethodFailureError, // 420
	// MisdirectedRequestError, // 421
	UnprocessableEntityError, // 422
	// LockedError, // 423
	// FailedDependencyError, // 424
	// PreconditionRequiredError, // 428
	// TooManyRequestsError, // 429
	// RequestHeaderFieldsTooLargeError, // 431
	// UnavailableForLegalReasonsError, // 451
	// InternalServerError, // 500
	// NotImplementedError, // 501
	// BadGatewayError, // 502
	// ServiceUnavailableError, // 503
	// GatewayTimeoutError, // 504
	// HttpVersionNotSupportedError, // 505
	// NetworkAuthenticationRequiredError // 511
};

export default _ERROR ;