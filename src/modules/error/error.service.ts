
import _ERROR from "../../_core/helper/async-handler/error/error.response";
interface UserInput {
    email?: string;
    password?: string;
    age?: number;
}

interface ValidationError {
    field: string;
    message: string;
    code: string;
}

export class ErrorTestService {
    private validateUser(data: UserInput): ValidationError[] {
        const errors: ValidationError[] = [];
        
        // Check multiple fields
        if (!data.email) {
            errors.push({
                field: 'email',
                message: 'Email is required',
                code: 'FIELD_REQUIRED'
            });
        }
        
        if (data.password && data.password.length < 8) {
            errors.push({
                field: 'password',
                message: 'Password must be at least 8 characters',
                code: 'INVALID_LENGTH'
            });
        }
    
        if (data.age && data.age < 18) {
            errors.push({
                field: 'age',
                message: 'Must be 18 or older',
                code: 'INVALID_VALUE'
            });
        }
    
        return errors;
    }

    async BadRequestError(data: UserInput): Promise<never> {
        const validationErrors = this.validateUser(data);
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




