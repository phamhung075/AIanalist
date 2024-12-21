import _ERROR from "../async-handler/error/error.response";
import { ValidationRule, ValidationError } from "./interface/validation.interface";

export function validateData<T>(data: T, rules: ValidationRule<T>[]): ValidationError[] {
    const errors: ValidationError[] = [];

    rules.forEach(rule => {
        const value = data[rule.field];
        if (!rule.validate(value)) {
            errors.push({
                field: String(rule.field),
                message: rule.message,
                code: rule.code
            });
        }
    });

    return errors;
}

export function handleValidationErrors(errors: ValidationError[]): void {
    if (errors.length > 0) {
        throw new _ERROR.ValidationError({
            message: 'Validate Data failed',
            errors: errors
        });
    }
}