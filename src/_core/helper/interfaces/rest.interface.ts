export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface MetaData {
    code: number;
    status: string;
    message?: string;
    path?: string;
    timestamp: string;
    pagination?: PaginationMeta;
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
    data: T | null;
    metadata: MetaData;    
    errors?: Array<{
        code: string;
        message: string;
        field?: string;
    }>;
}


export interface RequestMeta {
    id: string;
    timestamp: string;
    method: string;
    url: string;
}