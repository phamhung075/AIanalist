
import { StatusCodes } from "@/_core/helper/async-handler/common/statusCodes";
import _ERROR, { ErrorResponse } from "../../_core/helper/async-handler/error/error.response";


export class ErrorTestService {

	async validateUser(data: any): Promise<any> {
		const errors = [];
		
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
	
		if (errors.length > 0) {
			throw new ErrorResponse({
				message: 'Validation failed',
				status: StatusCodes.BAD_REQUEST,
				code: 'VALIDATION_ERROR',
				errors: errors // Multiple errors for different fields
			});
		}
	}


	async BadRequestError(data: { 
		message?: string; 
		field?: string; 
		details?: any;
	}): Promise<any> {
		const result = await this.validateUser(data)
		console.log("validateUser:" ,result)
		return result
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




