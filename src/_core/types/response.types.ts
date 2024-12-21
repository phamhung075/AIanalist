export interface ApiResponse<T = any> {
    success: boolean;
    data: T | null;
    meta: {
        timestamp: string;
        code: number;
        status: string;
        message?: string;
        pagination?: PaginationMeta;
    };
    errors?: ApiError[];
}

export interface ApiError {
    code: string;
    message: string;
    field?: string;
    details?: any;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}