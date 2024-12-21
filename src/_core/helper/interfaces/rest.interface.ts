export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ResponseMeta {
    code: number;
    status: string;
    message?: string;
    timestamp: string;
    pagination?: PaginationMeta;
}

export interface RestResponse<T = any> {
    data: T | null;
    meta: ResponseMeta;
    links?: {
        self: string;
        first?: string;
        prev?: string;
        next?: string;
        last?: string;
    };
    errors?: Array<{
        code: string;
        message: string;
        field?: string;
    }>;
}