import { PaginationResult } from "../../interfaces/rest.interface";
import { API_CONFIG } from "./api-config";

export const createPagination = <T>(
    data: T[],
    totalItems: number,
    page: number = API_CONFIG.PAGINATION.DEFAULT_PAGE,
    limit: number = API_CONFIG.PAGINATION.DEFAULT_LIMIT
): PaginationResult<T> => {
    const totalPages = Math.ceil(totalItems / limit);
    return {
        data,
        meta: { 
            page,
            limit,
            totalItems,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
        }
    };
};