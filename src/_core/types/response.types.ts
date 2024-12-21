export interface ApiResponse<T> {
    success: boolean;
    code: number;
    message: string;
    data: T;
    metadata?: {
        timestamp: string;
        path: string;
        pagination?: {
            page: number;
            limit: number;
            total: number;
        };
        request?: {
            id: string;
            timestamp: string;
        };
        code?: number;
        status?: string;
    };
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