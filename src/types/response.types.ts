// Base metadata interface to avoid repetition
export interface BaseMetadata {
    timestamp: string;
    path: string;
    requestId?: string;
}

// Specific pagination interface
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// Complete metadata interface extending the base
export interface ResponseMetadata extends BaseMetadata {
    timestamp: string;
    pagination?: PaginationMeta;
    code?: number;
    status?: string;
}

// Main API Response interface
export interface ApiResponse<T> {
    success: boolean;
    code: number;
    message: string;
    data: T;
    metadata?: ResponseMetadata;
    errors?: ApiError[];
}

// Error specific interfaces
export interface ApiError {
    code: string;
    message: string;
    field?: string;
    details?: unknown;  // Using unknown instead of any for better type safety
}

// Full error response interface
export interface ApiErrorResponse {
    success: false;
    code: number;
    message: string;
    errors: ApiError[];
    metadata?: ResponseMetadata;
}