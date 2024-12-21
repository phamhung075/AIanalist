
import _ERROR from "../../_core/helper/async-handler/error/error.response";


export class ErrorTestService {


	async BadRequestError(data: { message?: string, field?: string }): Promise<never> {
		throw new _ERROR.BadRequestError({
			message: data.message || 'Bad Request',
			field: data.field
		});
	}
	// Example for one error type - apply same pattern to others
	async ValidationError(data: {
		message?: string,
		field?: string,
		errors?: Array<{ field: string; message: string }>
	}): Promise<never> {
		throw new _ERROR.UnprocessableEntityError({
			message: data.message || 'Validation failed',
			field: data.field,
			errors: data.errors
		});
	}

}




