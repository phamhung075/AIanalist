
import _ERROR from "../../_core/helper/async-handler/error/error.response";


export class ErrorTestService {


	async BadRequestError(message?: string): Promise<Error> {
		throw new _ERROR.BadRequestError(message);
	}

	async UnauthorizedError(message?: string): Promise<Error> {
		throw new _ERROR.UnauthorizedError(message);
	}

	async PaymentRequiredError(message?: string): Promise<Error> {
		throw new _ERROR.PaymentRequiredError(message);
	}

	async ForbiddenError(message?: string): Promise<Error> {
		throw new _ERROR.ForbiddenError(message);
	}

	async NotFoundError(message?: string): Promise<Error> {
		throw new _ERROR.NotFoundError(message);
	}

	async MethodNotAllowedError(message?: string): Promise<Error> {
		throw new _ERROR.MethodNotAllowedError(message);
	}

	async NotAcceptableError(message?: string): Promise<Error> {
		throw new _ERROR.NotAcceptableError(message);
	}

	async ProxyAuthenticationRequiredError(message?: string): Promise<Error> {
		throw new _ERROR.ProxyAuthenticationRequiredError(message);
	}

	async RequestTimeoutError(message?: string): Promise<Error> {
		throw new _ERROR.RequestTimeoutError(message);
	}

	async ConflictRequestError(message?: string): Promise<Error> {
		throw new _ERROR.ConflictRequestError(message);
	}

	async GoneError(message?: string): Promise<Error> {
		throw new _ERROR.GoneError(message);
	}

	async LengthRequiredError(message?: string): Promise<Error> {
		throw new _ERROR.LengthRequiredError(message);
	}

	async PreconditionFailedError(message?: string): Promise<Error> {
		throw new _ERROR.PreconditionFailedError(message);
	}

	async RequestTooLongError(message?: string): Promise<Error> {
		throw new _ERROR.RequestTooLongError(message);
	}

	async RequestUriTooLongError(message?: string): Promise<Error> {
		
		throw new _ERROR.RequestUriTooLongError(message);
	}

	async UnsupportedMediaTypeError(message?: string): Promise<Error> {
		throw new _ERROR.UnsupportedMediaTypeError(message);
	}

	async RequestedRangeNotSatisfiableError(message?: string): Promise<Error> {
		throw new _ERROR.RequestedRangeNotSatisfiableError(message);
	}

	async ExpectationFailedError(message?: string): Promise<Error> {
		throw new _ERROR.ExpectationFailedError(message);
	}

	async ImATeapotError(message?: string): Promise<Error> {
		throw new _ERROR.ImATeapotError(message);
	}

	async InsufficientStorageError(message?: string): Promise<Error> {
		throw new _ERROR.InsufficientStorageError(message);
	}

	async MethodFailureError(message?: string): Promise<Error> {
		throw new _ERROR.MethodFailureError(message);
	}

	async MisdirectedRequestError(message?: string): Promise<Error> {
		throw new _ERROR.MisdirectedRequestError(message);
	}

	async UnprocessableEntityError(message?: string): Promise<Error> {
		throw new _ERROR.UnprocessableEntityError(message);
	}

	async LockedError(message?: string): Promise<Error> {
		throw new _ERROR.LockedError(message);
	}

	async FailedDependencyError(message?: string): Promise<Error> {
		throw new _ERROR.FailedDependencyError(message);
	}

	async PreconditionRequiredError(message?: string): Promise<Error> {
		throw new _ERROR.PreconditionRequiredError(message);
	}

	async TooManyRequestsError(message?: string): Promise<Error> {
		throw new _ERROR.TooManyRequestsError(message);
	}

	async RequestHeaderFieldsTooLargeError(message?: string): Promise<Error> {
		throw new _ERROR.RequestHeaderFieldsTooLargeError(message);
	}

	async UnavailableForLegalReasonsError(message?: string): Promise<Error> {
		throw new _ERROR.UnavailableForLegalReasonsError(message);
	}

	async InternalServerError(message?: string): Promise<Error> {
		throw new _ERROR.InternalServerError(message);
	}

	async NotImplementedError(message?: string): Promise<Error> {
		throw new _ERROR.NotImplementedError(message);
	}

	async BadGatewayError(message?: string): Promise<Error> {
		throw new _ERROR.BadGatewayError(message);
	}

	async ServiceUnavailableError(message?: string): Promise<Error> {
		throw new _ERROR.ServiceUnavailableError(message);
	}

	async GatewayTimeoutError(message?: string): Promise<Error> {
		throw new _ERROR.GatewayTimeoutError(message);
	}

	async HttpVersionNotSupportedError(message?: string): Promise<Error> {
		throw new _ERROR.HttpVersionNotSupportedError(message);
	}

	async NetworkAuthenticationRequiredError(message?: string): Promise<Error> {
		throw new _ERROR.NetworkAuthenticationRequiredError(message);
	}


}




