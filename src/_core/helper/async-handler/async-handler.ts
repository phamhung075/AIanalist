import { NextFunction, Response } from 'express';
import { ErrorResponse } from './error/error.response';
import { HttpStatusCode } from './common/httpStatusCode';
import { ExtendedFunctionRequest } from '../../guard/handle-permission/user-context.interface';
import { logResponseMiddleware } from '../log-response-middleware/log-response-middleware';
const { StatusCodes, ReasonPhrases } = HttpStatusCode


// Création d'un AsyncLocalStorage pour stocker le contexte de la requête


export const asyncHandlerFn = (
	fn: (req: ExtendedFunctionRequest, res: Response, next: NextFunction) => Promise<any>
) => {
	return logResponseMiddleware(async (req: ExtendedFunctionRequest, res: Response, next: NextFunction): Promise<void> => {
		try {
			// Execute the route handler function
			const result = await fn(req, res, next);

			// Send the response if it hasn't been sent yet
			if (!res.headersSent) {
				res.json({ result });
			}
		} catch (error: any) {
			// console.error('Caught error:', error);

			if (!res.headersSent) {
				let status = StatusCodes.INTERNAL_SERVER_ERROR;
				let message = ReasonPhrases.INTERNAL_SERVER_ERROR;
				const statusCodeKey = Object.keys(StatusCodes).find(
					(key) => StatusCodes[key as keyof typeof StatusCodes] === error.status
				);
				// Check if the error is an instance of your custom ErrorResponse class
				if (error instanceof ErrorResponse) {
					// Use the custom error's status and message
					status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
					message = `${ReasonPhrases[statusCodeKey as keyof typeof ReasonPhrases]}${error.message ? ", " + error.message : ""}` || ReasonPhrases.INTERNAL_SERVER_ERROR;
				} else if (typeof error.status === 'number') {
					// Get the property name (key) that matches the status code number


					// Set the status and message if the key is found
					if (statusCodeKey) {
						status = error.status;
						message = ReasonPhrases[statusCodeKey as keyof typeof ReasonPhrases]
							|| ReasonPhrases.INTERNAL_SERVER_ERROR;
					} else {
						console.error(`Status code ${error.status} not found in StatusCodes`);
					}
				} else {
					// Log if no valid status code was found
					console.error(`Error status not valid: ${error.status}`);
				}

				// Log the final status and message before sending the response
				console.log(`Sending response with status ${status} and message ${message}`);

				// Send the response with the status and reason phrase
				res.status(status).json(
					{
						error: true,
						code: status,
						type: statusCodeKey,
						message: message
					});
			}

			// Pass the error to the next middleware
			next(error);
		}
	});
};


