import { API_CONFIG } from "../api-config";
import { createPagination } from "../create-pagination";

describe('createPagination', () => {
    const mockData = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
    ];

    it('should create pagination with default values', () => {
        const result = createPagination(mockData, 3);
        
        expect(result).toEqual({
            data: mockData,
            meta: {
                page: API_CONFIG.PAGINATION.DEFAULT_PAGE,
                limit: API_CONFIG.PAGINATION.DEFAULT_LIMIT,
                totalItems: 3,
                totalPages: 1,
                hasNext: false,
                hasPrev: false
            }
        });
    });

    it('should calculate total pages correctly', () => {
        const result = createPagination(mockData, 10, 1, 3);
        
        expect(result.meta).toEqual({
            page: 1,
            limit: 3,
            totalItems: 10,
            totalPages: 4,
            hasNext: true,
            hasPrev: false
        });
    });

    it('should handle middle page navigation', () => {
        const result = createPagination(mockData, 10, 2, 3);
        
        expect(result.meta).toEqual({
            page: 2,
            limit: 3,
            totalItems: 10,
            totalPages: 4,
            hasNext: true,
            hasPrev: true
        });
    });

    it('should handle last page navigation', () => {
        const result = createPagination(mockData, 10, 4, 3);
        
        expect(result.meta).toEqual({
            page: 4,
            limit: 3,
            totalItems: 10,
            totalPages: 4,
            hasNext: false,
            hasPrev: true
        });
    });

    it('should handle empty data array', () => {
        const result = createPagination([], 0);
        
        expect(result).toEqual({
            data: [],
            meta: {
                page: API_CONFIG.PAGINATION.DEFAULT_PAGE,
                limit: API_CONFIG.PAGINATION.DEFAULT_LIMIT,
                totalItems: 0,
                totalPages: 0,
                hasNext: false,
                hasPrev: false
            }
        });
    });

    it('should handle single item', () => {
        const singleItem = [{ id: 1, name: 'Item 1' }];
        const result = createPagination(singleItem, 1);
        
        expect(result).toEqual({
            data: singleItem,
            meta: {
                page: API_CONFIG.PAGINATION.DEFAULT_PAGE,
                limit: API_CONFIG.PAGINATION.DEFAULT_LIMIT,
                totalItems: 1,
                totalPages: 1,
                hasNext: false,
                hasPrev: false
            }
        });
    });
});