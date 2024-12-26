import { HttpStatusCode } from "../http-status/common/StatusCodes";
{
	StatusCodes,
	ReasonPhrases
} = HttpStatusCode;

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
    path?: string;
    timestamp: string;
    request?: RequestMeta;
    responseTime?: string;
    links?: Link;
}

export interface RestResponse<T = any> {
    code?: StatusCodes;
    status: string;
    message?: string | ReasonPhrases;
    data?: Partial<T> | Partial<T>[];
    pagination?: PaginationResult<T>;
    metadata: MetaData;
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
export interface Link {
    self: string;
    first?: string;
    prev?: string;
    next?: string;
    last?: string;
};