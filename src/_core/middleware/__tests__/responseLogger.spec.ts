import { Request, Response, NextFunction } from 'express';
import { responseLogger } from '../responseLogger.middleware';

describe('responseLogger Middleware', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;
    let consoleLogSpy: jest.SpyInstance;
    let originalSend: any;

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            originalUrl: '/test-url',
            method: 'GET',
        };

        res = {
            statusCode: 200,
            send: jest.fn(),
        };

        next = jest.fn();
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

        // Store a reference to the original `res.send`
        originalSend = res.send;
    });

    it('should log the request and response details', () => {
        const mockBody = JSON.stringify({ message: 'Success' });

        // Apply middleware
        responseLogger(req as Request, res as Response, next);

        // Simulate res.send
        (res.send as any)(mockBody);

        expect(consoleLogSpy).toHaveBeenCalledWith('[Response Logger]');
        expect(consoleLogSpy).toHaveBeenCalledWith('➡️ URL:', '/test-url');
        expect(consoleLogSpy).toHaveBeenCalledWith('➡️ Method:', 'GET');
        expect(consoleLogSpy).toHaveBeenCalledWith('➡️ Status Code:', 200);
        expect(consoleLogSpy).toHaveBeenCalledWith('➡️ Response Body:', { message: 'Success' });

        expect(originalSend).toHaveBeenCalledWith(mockBody);
        expect(next).toHaveBeenCalled();
    });

    it('should pass control to the next middleware', () => {
        responseLogger(req as Request, res as Response, next);
        expect(next).toHaveBeenCalled();
    });
});
