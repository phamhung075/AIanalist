import { Response } from 'express';
import { CustomRequest } from '@/_core/guard/handle-permission/user-context.interface';
import { HttpStatusCode } from '../HttpStatusCode';
import { StatusCodes } from '../StatusCodes';
import { RestHandler } from '../RestHandler';
import { Link, PaginationResult } from '@/_core/helper/interfaces/rest.interface';

describe('RestHandler', () => {
    let mockReq: Partial<CustomRequest>;
    let mockRes: Partial<Response>;

    beforeEach(() => {
        mockReq = {
            startTime: Date.now(),
            method: 'GET',
            originalUrl: '/test'
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            req: mockReq as any
        };
    });

    describe('success', () => {
        it('should return success response with default values', () => {
            RestHandler.success(mockReq as CustomRequest, mockRes as Response, {});

            expect(mockRes.status).toHaveBeenCalledWith(HttpStatusCode.OK);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                code: HttpStatusCode.OK,
                message: StatusCodes[HttpStatusCode.OK].phrase,
                metadata: expect.objectContaining({
                    timestamp: expect.any(String),
                    statusCode: 'OK',
                    methode: 'GET',
                    path: '/test'
                })
            }));
        });

        it('should include pagination and links when provided', () => {
            const pagination: PaginationResult<unknown> = {
                data: [],
                meta: {
                    page: 1,
                    limit: 10,
                    totalItems: 20,
                    totalPages: 2,
                    hasNext: true,
                    hasPrev: false
                }
            };
             const links: Link = {
                self: '/test',
                next: '/test?page=2',
                first: '/test?page=1',
                last: '/test?page=2' 
            };

            RestHandler.success(mockReq as CustomRequest, mockRes as Response, {
                pagination,
                links
            });

            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                metadata: expect.objectContaining({
                    pagination,
                    links
                })
            }));
        });

        it('should include response time when startTime is provided', () => {
            RestHandler.success(mockReq as CustomRequest, mockRes as Response, {});

            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                metadata: expect.objectContaining({
                    responseTime: expect.stringMatching(/^\d+ms$/)
                })
            }));
        });
    });

    describe('error', () => {
        it('should return error response with default values', () => {
            RestHandler.error(mockReq as CustomRequest, mockRes as Response, {});

            expect(mockRes.status).toHaveBeenCalledWith(HttpStatusCode.INTERNAL_SERVER_ERROR);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                code: HttpStatusCode.INTERNAL_SERVER_ERROR,
                message: StatusCodes[HttpStatusCode.INTERNAL_SERVER_ERROR].phrase,
                metadata: expect.objectContaining({
                    timestamp: expect.any(String),
                    statusCode: 'INTERNAL_SERVER_ERROR'
                })
            }));
        });

        it('should include validation errors when provided', () => {
            const errors = [{ field: 'test', message: 'Invalid value' }];

            RestHandler.error(mockReq as CustomRequest, mockRes as Response, {
                errors
            });

            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                errors
            }));
        });
    });

    describe('getStatusText', () => {
        it('should return correct status text for valid code', () => {
            const result = RestHandler.getStatusText(HttpStatusCode.OK);
            expect(result).toBe('OK');
        });

        it('should return UNKNOWN_STATUS for invalid code', () => {
            const result = RestHandler.getStatusText(999999);
            expect(result).toBe('UNKNOWN_STATUS');
        });
    });
});