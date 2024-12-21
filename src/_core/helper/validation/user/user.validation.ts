import { validateData } from "..";
import { ValidationError, ValidationRule } from "../interface/validation.interface";

export interface UserInput {
    email?: string;
    password?: string;
    age?: number;
}

const validationRules: ValidationRule<UserInput>[] = [
    {
        field: 'email',
        validate: (value) => Boolean(value && value.includes('@')),
        message: 'Email is required and must be valid',
        code: 'FIELD_REQUIRED'
    },
    {
        field: 'password',
        validate: (value) => value?.length >= 8,
        message: 'Password must be at least 8 characters',
        code: 'INVALID_LENGTH'
    },
    {
        field: 'age',
        validate: (value) => value === undefined || value >= 18,
        message: 'Must be 18 or older',
        code: 'INVALID_VALUE'
    }
];

export function validateUser(data: UserInput): ValidationError[] {
    return validateData(data, validationRules);
}
