
export interface PaginationParams {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
}

export interface PaginationResult<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        totalItems?: number;
        totalPages?: number;
        hasNext?: boolean;
        hasPrev?: boolean;
    };
}

export interface MetaData<T> {
    code: number;
    status: string;
    message?: string;
    path?: string;
    timestamp: string;
    pagination?: PaginationResult<T>;
    request?: RequestMeta;
    responseTime?: string;
    links?: {
        self: string;
        first?: string;
        prev?: string;
        next?: string;
        last?: string;
    };
}

export interface RestResponse<T = any> {
    data?: T | T[];
    metadata: MetaData<T>;    
    errors?: Array<{
        code: string;
        message: string;
        field?: string;
    }>;
}


export interface RequestMeta {
    id?: string;
    timestamp?: string;
    method?: string;
    url?: string;
}