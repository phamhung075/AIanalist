import * as express from 'express';
import { asyncHandlerFn } from '../../_core/helper/async-handler/async-handler';
import { errorTestCloudService } from '.';

// Créer un routeur Express


const router = express.Router();

const cloudFunctions_v1_get = {
	"Error-BadRequestError": errorTestCloudService.BadRequestError,
	"Error-UnauthorizedError": errorTestCloudService.UnauthorizedError,
	"Error-PaymentRequiredError": errorTestCloudService.PaymentRequiredError,
	"Error-ForbiddenError": errorTestCloudService.ForbiddenError,
	"Error-NotFoundError": errorTestCloudService.NotFoundError,
	"Error-MethodNotAllowedError": errorTestCloudService.MethodNotAllowedError,
	"Error-NotAcceptableError": errorTestCloudService.NotAcceptableError,
	"Error-ProxyAuthenticationRequiredError": errorTestCloudService.ProxyAuthenticationRequiredError,
	"Error-RequestTimeoutError": errorTestCloudService.RequestTimeoutError,
	"Error-ConflictRequestError": errorTestCloudService.ConflictRequestError,
	"Error-GoneError": errorTestCloudService.GoneError,
	"Error-LengthRequiredError": errorTestCloudService.LengthRequiredError,
	"Error-PreconditionFailedError": errorTestCloudService.PreconditionFailedError,
	"Error-RequestTooLongError": errorTestCloudService.RequestTooLongError,
	"Error-RequestUriTooLongError": errorTestCloudService.RequestUriTooLongError,
	"Error-UnsupportedMediaTypeError": errorTestCloudService.UnsupportedMediaTypeError,
	"Error-RequestedRangeNotSatisfiableError": errorTestCloudService.RequestedRangeNotSatisfiableError,
	"Error-ExpectationFailedError": errorTestCloudService.ExpectationFailedError,
	"Error-ImATeapotError": errorTestCloudService.ImATeapotError,
	"Error-InsufficientStorageError": errorTestCloudService.InsufficientStorageError,
	"Error-MethodFailureError": errorTestCloudService.MethodFailureError,
	"Error-MisdirectedRequestError": errorTestCloudService.MisdirectedRequestError,
	"Error-UnprocessableEntityError": errorTestCloudService.UnprocessableEntityError,
	"Error-LockedError": errorTestCloudService.LockedError,
	"Error-FailedDependencyError": errorTestCloudService.FailedDependencyError,
	"Error-PreconditionRequiredError": errorTestCloudService.PreconditionRequiredError,
	"Error-TooManyRequestsError": errorTestCloudService.TooManyRequestsError,
	"Error-RequestHeaderFieldsTooLargeError": errorTestCloudService.RequestHeaderFieldsTooLargeError,
	"Error-UnavailableForLegalReasonsError": errorTestCloudService.UnavailableForLegalReasonsError,
	"Error-InternalServerError": errorTestCloudService.InternalServerError,
	"Error-NotImplementedError": errorTestCloudService.NotImplementedError,
	"Error-BadGatewayError": errorTestCloudService.BadGatewayError,
	"Error-ServiceUnavailableError": errorTestCloudService.ServiceUnavailableError,
	"Error-GatewayTimeoutError": errorTestCloudService.GatewayTimeoutError,
	"Error-HttpVersionNotSupportedError": errorTestCloudService.HttpVersionNotSupportedError,
	"Error-NetworkAuthenticationRequiredError": errorTestCloudService.NetworkAuthenticationRequiredError,
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