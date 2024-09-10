import { ExtendedUserContextRequest } from "../../interfaces/ExtendedFunctionRequest.interface";
import { SuccessTestService } from "./success.service";

export class SuccessTestCloudService {

    constructor(
		private readonly errorTestService: SuccessTestService
    ) { }

	async BadRequestSuccess(_req: ExtendedUserContextRequest): Promise<SuccessResponse> {
		return this.errorTestService.BadRequestSuccess(_req.body.message);
	}

	async UnauthorizedSuccess(_req: ExtendedUserContextRequest): Promise<Success> {
		return this.errorTestService.UnauthorizedSuccess(_req.body.message);
	}

	async PaymentRequiredSuccess(_req: ExtendedUserContextRequest): Promise<Success> {
		return this.errorTestService.PaymentRequiredSuccess(_req.body.message);
	}

	async ForbiddenSuccess(_req: ExtendedUserContextRequest): Promise<Success> {
		return this.errorTestService.ForbiddenSuccess(_req.body.message);
	}

	async NotFoundSuccess(_req: ExtendedUserContextRequest): Promise<Success> {
		return this.errorTestService.NotFoundSuccess(_req.body.message);
	}

	async MethodNotAllowedSuccess(_req: ExtendedUserContextRequest): Promise<Success> {
		return this.errorTestService.MethodNotAllowedSuccess(_req.body.message);
	}

	async NotAcceptableSuccess(_req: ExtendedUserContextRequest): Promise<Success> {
		return this.errorTestService.NotAcceptableSuccess(_req.body.message);
	}

	async ProxyAuthenticationRequiredSuccess(_req: ExtendedUserContextRequest): Promise<Success> {
		return this.errorTestService.ProxyAuthenticationRequiredSuccess(_req.body.message);
	}

	async RequestTimeoutSuccess(_req: ExtendedUserContextRequest): Promise<Success> {
		return this.errorTestService.RequestTimeoutSuccess(_req.body.message);
	}

	async ConflictRequestSuccess(_req: ExtendedUserContextRequest): Promise<Success> {
		return this.errorTestService.ConflictRequestSuccess(_req.body.message);
	}

	async GoneSuccess(_req: ExtendedUserContextRequest): Promise<Success> {
		return this.errorTestService.GoneSuccess(_req.body.message);
	}

	async LengthRequiredSuccess(_req: ExtendedUserContextRequest): Promise<Success> {
		return this.errorTestService.LengthRequiredSuccess(_req.body.message);
	}

	async PreconditionFailedSuccess(_req: ExtendedUserContextRequest): Promise<Success> {
		return this.errorTestService.PreconditionFailedSuccess(_req.body.message);
	}

	async RequestTooLongSuccess(_req: ExtendedUserContextRequest): Promise<Success> {
		return this.errorTestService.RequestTooLongSuccess(_req.body.message);
	}

	async RequestUriTooLongSuccess(_req: ExtendedUserContextRequest): Promise<Success> {
		return this.errorTestService.RequestUriTooLongSuccess(_req.body.message);
	}

	async UnsupportedMediaTypeSuccess(_req: ExtendedUserContextRequest): Promise<Success> {
		return this.errorTestService.UnsupportedMediaTypeSuccess(_req.body.message);
	}

	async RequestedRangeNotSatisfiableSuccess(_req: ExtendedUserContextRequest): Promise<Success> {
		return this.errorTestService.RequestedRangeNotSatisfiableSuccess(_req.body.message);
	}

	async ExpectationFailedSuccess(_req: ExtendedUserContextRequest): Promise<Success> {
		return this.errorTestService.ExpectationFailedSuccess(_req.body.message);
	}

	async ImATeapotSuccess(_req: ExtendedUserContextRequest): Promise<Success> {
		return this.errorTestService.ImATeapotSuccess(_req.body.message);
	}

	async InsufficientStorageSuccess(_req: ExtendedUserContextRequest): Promise<Success> {
		return this.errorTestService.InsufficientStorageSuccess(_req.body.message);
	}

	async MethodFailureSuccess(_req: ExtendedUserContextRequest): Promise<Success> {
		return this.errorTestService.MethodFailureSuccess(_req.body.message);
	}

	async MisdirectedRequestSuccess(_req: ExtendedUserContextRequest): Promise<Success> {
		return this.errorTestService.MisdirectedRequestSuccess(_req.body.message);
	}

	async UnprocessableEntitySuccess(_req: ExtendedUserContextRequest): Promise<Success> {
		return this.errorTestService.UnprocessableEntitySuccess(_req.body.message);
	}

	async LockedSuccess(_req: ExtendedUserContextRequest): Promise<Success> {
		return this.errorTestService.LockedSuccess(_req.body.message);
	}

	async FailedDependencySuccess(_req: ExtendedUserContextRequest): Promise<Success> {
		return this.errorTestService.FailedDependencySuccess(_req.body.message);
	}

	async PreconditionRequiredSuccess(_req: ExtendedUserContextRequest): Promise<Success> {
		return this.errorTestService.PreconditionRequiredSuccess(_req.body.message);
	}

	async TooManyRequestsSuccess(_req: ExtendedUserContextRequest): Promise<Success> {
		return this.errorTestService.TooManyRequestsSuccess(_req.body.message);
	}

	async RequestHeaderFieldsTooLargeSuccess(_req: ExtendedUserContextRequest): Promise<Success> {
		return this.errorTestService.RequestHeaderFieldsTooLargeSuccess(_req.body.message);
	}

	async UnavailableForLegalReasonsSuccess(_req: ExtendedUserContextRequest): Promise<Success> {
		return this.errorTestService.UnavailableForLegalReasonsSuccess(_req.body.message);
	}

	async InternalServerSuccess(_req: ExtendedUserContextRequest): Promise<Success> {
		return this.errorTestService.InternalServerSuccess(_req.body.message);
	}

	async NotImplementedSuccess(_req: ExtendedUserContextRequest): Promise<Success> {
		return this.errorTestService.NotImplementedSuccess(_req.body.message);
	}

	async BadGatewaySuccess(_req: ExtendedUserContextRequest): Promise<Success> {
		return this.errorTestService.BadGatewaySuccess(_req.body.message);
	}

	async ServiceUnavailableSuccess(_req: ExtendedUserContextRequest): Promise<Success> {
		return this.errorTestService.ServiceUnavailableSuccess(_req.body.message);
	}

	async GatewayTimeoutSuccess(_req: ExtendedUserContextRequest): Promise<Success> {
		return this.errorTestService.GatewayTimeoutSuccess(_req.body.message);
	}

	async HttpVersionNotSupportedSuccess(_req: ExtendedUserContextRequest): Promise<Success> {
		return this.errorTestService.HttpVersionNotSupportedSuccess(_req.body.message);
	}

	async NetworkAuthenticationRequiredSuccess(_req: ExtendedUserContextRequest): Promise<Success> {
		return this.errorTestService.NetworkAuthenticationRequiredSuccess(_req.body.message);
	}


}
