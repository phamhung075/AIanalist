import { HttpStatusCode } from "../http-status/common/HttpStatusCode";

export interface PaginationParams {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
}

export interface PaginationResult<T> {
    data: Partial<T>[]; // Ensure it's always an array
    meta: {
        page: number;
        limit: number;
        totalItems?: number;
        totalPages?: number;
        hasNext?: boolean;
        hasPrev?: boolean;
    };
}


export interface MetaData {   
    timestamp: string;
    statusCode?: string;
    path?: string;
    methode?: string;
    request?: RequestMeta;
    responseTime?: string;
    links?: Link;
    description?: string;
    documentation?: string;
}

export interface RestResponse<T = any> {
    success?: boolean;
    code?: HttpStatusCode;
    message?: string;
    data?: Partial<T> | Partial<T>[];
    pagination?: PaginationResult<T>;
    metadata: MetaData;
    errors?: ValidationError[];
}

export interface ValidationError {
    field: string;
    message: string;
    code?: string;
}

export interface RequestMeta {
    id?: string;
    timestamp?: string;
    method?: string;
    url?: string;
}
export interface Link {
    self: string;
    first?: string;
    prev?: string;
    next?: string;
    last?: string;
};