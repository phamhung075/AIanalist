// ValidationError type to standardize error responses

// ValidationRule defines a rule for validation
export type ValidationRule<T> = {
    field: keyof T;
    validate: (value: any) => boolean;
    message: string;
    code: string;
};