import * as express from 'express';
import { asyncHandlerFn } from '../../_core/helper/async-handler/async-handler';
import { errorTestCloudService } from '.';

// Créer un routeur Express


const router = express.Router();

const cloudFunctions_v1_get = {
	"Success-BadRequestSuccess": errorTestCloudService.BadRequestSuccess,
	"Success-UnauthorizedSuccess": errorTestCloudService.UnauthorizedSuccess,
	"Success-PaymentRequiredSuccess": errorTestCloudService.PaymentRequiredSuccess,
	"Success-ForbiddenSuccess": errorTestCloudService.ForbiddenSuccess,
	"Success-NotFoundSuccess": errorTestCloudService.NotFoundSuccess,
	"Success-MethodNotAllowedSuccess": errorTestCloudService.MethodNotAllowedSuccess,
	"Success-NotAcceptableSuccess": errorTestCloudService.NotAcceptableSuccess,
	"Success-ProxyAuthenticationRequiredSuccess": errorTestCloudService.ProxyAuthenticationRequiredSuccess,
	"Success-RequestTimeoutSuccess": errorTestCloudService.RequestTimeoutSuccess,
	"Success-ConflictRequestSuccess": errorTestCloudService.ConflictRequestSuccess,
	"Success-GoneSuccess": errorTestCloudService.GoneSuccess,
	"Success-LengthRequiredSuccess": errorTestCloudService.LengthRequiredSuccess,
	"Success-PreconditionFailedSuccess": errorTestCloudService.PreconditionFailedSuccess,
	"Success-RequestTooLongSuccess": errorTestCloudService.RequestTooLongSuccess,
	"Success-RequestUriTooLongSuccess": errorTestCloudService.RequestUriTooLongSuccess,
	"Success-UnsupportedMediaTypeSuccess": errorTestCloudService.UnsupportedMediaTypeSuccess,
	"Success-RequestedRangeNotSatisfiableSuccess": errorTestCloudService.RequestedRangeNotSatisfiableSuccess,
	"Success-ExpectationFailedSuccess": errorTestCloudService.ExpectationFailedSuccess,
	"Success-ImATeapotSuccess": errorTestCloudService.ImATeapotSuccess,
	"Success-InsufficientStorageSuccess": errorTestCloudService.InsufficientStorageSuccess,
	"Success-MethodFailureSuccess": errorTestCloudService.MethodFailureSuccess,
	"Success-MisdirectedRequestSuccess": errorTestCloudService.MisdirectedRequestSuccess,
	"Success-UnprocessableEntitySuccess": errorTestCloudService.UnprocessableEntitySuccess,
	"Success-LockedSuccess": errorTestCloudService.LockedSuccess,
	"Success-FailedDependencySuccess": errorTestCloudService.FailedDependencySuccess,
	"Success-PreconditionRequiredSuccess": errorTestCloudService.PreconditionRequiredSuccess,
	"Success-TooManyRequestsSuccess": errorTestCloudService.TooManyRequestsSuccess,
	"Success-RequestHeaderFieldsTooLargeSuccess": errorTestCloudService.RequestHeaderFieldsTooLargeSuccess,
	"Success-UnavailableForLegalReasonsSuccess": errorTestCloudService.UnavailableForLegalReasonsSuccess,
	"Success-InternalServerSuccess": errorTestCloudService.InternalServerSuccess,
	"Success-NotImplementedSuccess": errorTestCloudService.NotImplementedSuccess,
	"Success-BadGatewaySuccess": errorTestCloudService.BadGatewaySuccess,
	"Success-ServiceUnavailableSuccess": errorTestCloudService.ServiceUnavailableSuccess,
	"Success-GatewayTimeoutSuccess": errorTestCloudService.GatewayTimeoutSuccess,
	"Success-HttpVersionNotSupportedSuccess": errorTestCloudService.HttpVersionNotSupportedSuccess,
	"Success-NetworkAuthenticationRequiredSuccess": errorTestCloudService.NetworkAuthenticationRequiredSuccess,
};

// Convertir chaque fonction en une route Express
Object.entries(cloudFunctions_v1_get).forEach(([functionName, functionHandler]) => {
	router.get(
		`/${functionName}`,
		// authenticateToken, // Add the authentication middleware here
		asyncHandlerFn(
			functionHandler.bind(errorTestCloudService)
		)
	)
});


export default router;