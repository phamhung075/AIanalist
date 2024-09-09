import { ExtendedUserContextRequest } from "../../interfaces/ExtendedFunctionRequest.interface";
import { ErrorTestService } from "./error.service";

export class ErrorTestCloudService {

    constructor(
		private readonly errorTestService: ErrorTestService
    ) { }

	async BadRequestError(_req: ExtendedUserContextRequest): Promise<Error> {
		return this.errorTestService.BadRequestError(_req.body.message);
	}

	async UnauthorizedError(_req: ExtendedUserContextRequest): Promise<Error> {
		return this.errorTestService.UnauthorizedError(_req.body.message);
	}

	async PaymentRequiredError(_req: ExtendedUserContextRequest): Promise<Error> {
		return this.errorTestService.PaymentRequiredError(_req.body.message);
	}

	async ForbiddenError(_req: ExtendedUserContextRequest): Promise<Error> {
		return this.errorTestService.ForbiddenError(_req.body.message);
	}

	async NotFoundError(_req: ExtendedUserContextRequest): Promise<Error> {
		return this.errorTestService.NotFoundError(_req.body.message);
	}

	async MethodNotAllowedError(_req: ExtendedUserContextRequest): Promise<Error> {
		return this.errorTestService.MethodNotAllowedError(_req.body.message);
	}

	async NotAcceptableError(_req: ExtendedUserContextRequest): Promise<Error> {
		return this.errorTestService.NotAcceptableError(_req.body.message);
	}

	async ProxyAuthenticationRequiredError(_req: ExtendedUserContextRequest): Promise<Error> {
		return this.errorTestService.ProxyAuthenticationRequiredError(_req.body.message);
	}

	async RequestTimeoutError(_req: ExtendedUserContextRequest): Promise<Error> {
		return this.errorTestService.RequestTimeoutError(_req.body.message);
	}

	async ConflictRequestError(_req: ExtendedUserContextRequest): Promise<Error> {
		return this.errorTestService.ConflictRequestError(_req.body.message);
	}

	async GoneError(_req: ExtendedUserContextRequest): Promise<Error> {
		return this.errorTestService.GoneError(_req.body.message);
	}

	async LengthRequiredError(_req: ExtendedUserContextRequest): Promise<Error> {
		return this.errorTestService.LengthRequiredError(_req.body.message);
	}

	async PreconditionFailedError(_req: ExtendedUserContextRequest): Promise<Error> {
		return this.errorTestService.PreconditionFailedError(_req.body.message);
	}

	async RequestTooLongError(_req: ExtendedUserContextRequest): Promise<Error> {
		return this.errorTestService.RequestTooLongError(_req.body.message);
	}

	async RequestUriTooLongError(_req: ExtendedUserContextRequest): Promise<Error> {
		return this.errorTestService.RequestUriTooLongError(_req.body.message);
	}

	async UnsupportedMediaTypeError(_req: ExtendedUserContextRequest): Promise<Error> {
		return this.errorTestService.UnsupportedMediaTypeError(_req.body.message);
	}

	async RequestedRangeNotSatisfiableError(_req: ExtendedUserContextRequest): Promise<Error> {
		return this.errorTestService.RequestedRangeNotSatisfiableError(_req.body.message);
	}

	async ExpectationFailedError(_req: ExtendedUserContextRequest): Promise<Error> {
		return this.errorTestService.ExpectationFailedError(_req.body.message);
	}

	async ImATeapotError(_req: ExtendedUserContextRequest): Promise<Error> {
		return this.errorTestService.ImATeapotError(_req.body.message);
	}

	async InsufficientStorageError(_req: ExtendedUserContextRequest): Promise<Error> {
		return this.errorTestService.InsufficientStorageError(_req.body.message);
	}

	async MethodFailureError(_req: ExtendedUserContextRequest): Promise<Error> {
		return this.errorTestService.MethodFailureError(_req.body.message);
	}

	async MisdirectedRequestError(_req: ExtendedUserContextRequest): Promise<Error> {
		return this.errorTestService.MisdirectedRequestError(_req.body.message);
	}

	async UnprocessableEntityError(_req: ExtendedUserContextRequest): Promise<Error> {
		return this.errorTestService.UnprocessableEntityError(_req.body.message);
	}

	async LockedError(_req: ExtendedUserContextRequest): Promise<Error> {
		return this.errorTestService.LockedError(_req.body.message);
	}

	async FailedDependencyError(_req: ExtendedUserContextRequest): Promise<Error> {
		return this.errorTestService.FailedDependencyError(_req.body.message);
	}

	async PreconditionRequiredError(_req: ExtendedUserContextRequest): Promise<Error> {
		return this.errorTestService.PreconditionRequiredError(_req.body.message);
	}

	async TooManyRequestsError(_req: ExtendedUserContextRequest): Promise<Error> {
		return this.errorTestService.TooManyRequestsError(_req.body.message);
	}

	async RequestHeaderFieldsTooLargeError(_req: ExtendedUserContextRequest): Promise<Error> {
		return this.errorTestService.RequestHeaderFieldsTooLargeError(_req.body.message);
	}

	async UnavailableForLegalReasonsError(_req: ExtendedUserContextRequest): Promise<Error> {
		return this.errorTestService.UnavailableForLegalReasonsError(_req.body.message);
	}

	async InternalServerError(_req: ExtendedUserContextRequest): Promise<Error> {
		return this.errorTestService.InternalServerError(_req.body.message);
	}

	async NotImplementedError(_req: ExtendedUserContextRequest): Promise<Error> {
		return this.errorTestService.NotImplementedError(_req.body.message);
	}

	async BadGatewayError(_req: ExtendedUserContextRequest): Promise<Error> {
		return this.errorTestService.BadGatewayError(_req.body.message);
	}

	async ServiceUnavailableError(_req: ExtendedUserContextRequest): Promise<Error> {
		return this.errorTestService.ServiceUnavailableError(_req.body.message);
	}

	async GatewayTimeoutError(_req: ExtendedUserContextRequest): Promise<Error> {
		return this.errorTestService.GatewayTimeoutError(_req.body.message);
	}

	async HttpVersionNotSupportedError(_req: ExtendedUserContextRequest): Promise<Error> {
		return this.errorTestService.HttpVersionNotSupportedError(_req.body.message);
	}

	async NetworkAuthenticationRequiredError(_req: ExtendedUserContextRequest): Promise<Error> {
		return this.errorTestService.NetworkAuthenticationRequiredError(_req.body.message);
	}


}
