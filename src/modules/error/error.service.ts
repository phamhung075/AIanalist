
import { UserInput, validateUser } from "@/_core/helper/validation/user/user.validation";
import _ERROR from "../../_core/helper/async-handler/error/error.response";




export class ErrorTestService {    

    async BadRequestError(data: UserInput): Promise<never> {
        const validationErrors = validateUser(data);
        if (validationErrors.length > 0) {
            throw new _ERROR.BadRequestError({
                message: 'Validation failed',
                errors: validationErrors
            });
        }

        // If we get here, validation passed
        throw new _ERROR.BadRequestError({
            message: 'This is a test error',
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




