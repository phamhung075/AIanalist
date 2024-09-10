
import _ERROR from "../../_core/helper/async-handler/error/error.response";


export class SuccessTestService {


	async BadRequestSuccess(message?: string): Promise<Success> {
		throw new _ERROR.BadRequestSuccess(message);
	}

	async UnauthorizedSuccess(message?: string): Promise<Success> {
		throw new _ERROR.UnauthorizedSuccess(message);
	}

	async PaymentRequiredSuccess(message?: string): Promise<Success> {
		throw new _ERROR.PaymentRequiredSuccess(message);
	}

	async ForbiddenSuccess(message?: string): Promise<Success> {
		throw new _ERROR.ForbiddenSuccess(message);
	}

	async NotFoundSuccess(message?: string): Promise<Success> {
		throw new _ERROR.NotFoundSuccess(message);
	}

	async MethodNotAllowedSuccess(message?: string): Promise<Success> {
		throw new _ERROR.MethodNotAllowedSuccess(message);
	}

	async NotAcceptableSuccess(message?: string): Promise<Success> {
		throw new _ERROR.NotAcceptableSuccess(message);
	}

	async ProxyAuthenticationRequiredSuccess(message?: string): Promise<Success> {
		throw new _ERROR.ProxyAuthenticationRequiredSuccess(message);
	}

	async RequestTimeoutSuccess(message?: string): Promise<Success> {
		throw new _ERROR.RequestTimeoutSuccess(message);
	}

	async ConflictRequestSuccess(message?: string): Promise<Success> {
		throw new _ERROR.ConflictRequestSuccess(message);
	}

	async GoneSuccess(message?: string): Promise<Success> {
		throw new _ERROR.GoneSuccess(message);
	}

	async LengthRequiredSuccess(message?: string): Promise<Success> {
		throw new _ERROR.LengthRequiredSuccess(message);
	}

	async PreconditionFailedSuccess(message?: string): Promise<Success> {
		throw new _ERROR.PreconditionFailedSuccess(message);
	}

	async RequestTooLongSuccess(message?: string): Promise<Success> {
		throw new _ERROR.RequestTooLongSuccess(message);
	}

	async RequestUriTooLongSuccess(message?: string): Promise<Success> {
		
		throw new _ERROR.RequestUriTooLongSuccess(message);
	}

	async UnsupportedMediaTypeSuccess(message?: string): Promise<Success> {
		throw new _ERROR.UnsupportedMediaTypeSuccess(message);
	}

	async RequestedRangeNotSatisfiableSuccess(message?: string): Promise<Success> {
		throw new _ERROR.RequestedRangeNotSatisfiableSuccess(message);
	}

	async ExpectationFailedSuccess(message?: string): Promise<Success> {
		throw new _ERROR.ExpectationFailedSuccess(message);
	}

	async ImATeapotSuccess(message?: string): Promise<Success> {
		throw new _ERROR.ImATeapotSuccess(message);
	}

	async InsufficientStorageSuccess(message?: string): Promise<Success> {
		throw new _ERROR.InsufficientStorageSuccess(message);
	}

	async MethodFailureSuccess(message?: string): Promise<Success> {
		throw new _ERROR.MethodFailureSuccess(message);
	}

	async MisdirectedRequestSuccess(message?: string): Promise<Success> {
		throw new _ERROR.MisdirectedRequestSuccess(message);
	}

	async UnprocessableEntitySuccess(message?: string): Promise<Success> {
		throw new _ERROR.UnprocessableEntitySuccess(message);
	}

	async LockedSuccess(message?: string): Promise<Success> {
		throw new _ERROR.LockedSuccess(message);
	}

	async FailedDependencySuccess(message?: string): Promise<Success> {
		throw new _ERROR.FailedDependencySuccess(message);
	}

	async PreconditionRequiredSuccess(message?: string): Promise<Success> {
		throw new _ERROR.PreconditionRequiredSuccess(message);
	}

	async TooManyRequestsSuccess(message?: string): Promise<Success> {
		throw new _ERROR.TooManyRequestsSuccess(message);
	}

	async RequestHeaderFieldsTooLargeSuccess(message?: string): Promise<Success> {
		throw new _ERROR.RequestHeaderFieldsTooLargeSuccess(message);
	}

	async UnavailableForLegalReasonsSuccess(message?: string): Promise<Success> {
		throw new _ERROR.UnavailableForLegalReasonsSuccess(message);
	}

	async InternalServerSuccess(message?: string): Promise<Success> {
		throw new _ERROR.InternalServerSuccess(message);
	}

	async NotImplementedSuccess(message?: string): Promise<Success> {
		throw new _ERROR.NotImplementedSuccess(message);
	}

	async BadGatewaySuccess(message?: string): Promise<Success> {
		throw new _ERROR.BadGatewaySuccess(message);
	}

	async ServiceUnavailableSuccess(message?: string): Promise<Success> {
		throw new _ERROR.ServiceUnavailableSuccess(message);
	}

	async GatewayTimeoutSuccess(message?: string): Promise<Success> {
		throw new _ERROR.GatewayTimeoutSuccess(message);
	}

	async HttpVersionNotSupportedSuccess(message?: string): Promise<Success> {
		throw new _ERROR.HttpVersionNotSupportedSuccess(message);
	}

	async NetworkAuthenticationRequiredSuccess(message?: string): Promise<Success> {
		throw new _ERROR.NetworkAuthenticationRequiredSuccess(message);
	}


}




