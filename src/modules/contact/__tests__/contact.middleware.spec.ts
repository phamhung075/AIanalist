// __tests__/contact.middleware.spec.ts
// import { Request, Response, NextFunction } from 'express';
import { validateSchema } from '@/_core/middleware/validateSchema.middleware';
import { CreateContactSchema } from '../contact.validation';

describe('Contact Middleware - validateSchema', () => {
  it('should pass validation', () => {
    const mockRequest = {
      startTime: Date.now(), // Ensure startTime exists
      body: {
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '1234567890',
      }
    };
    const mockResponse = {};
    const mockNext = jest.fn();

    expect(() => validateSchema(CreateContactSchema)(mockRequest as any, mockResponse as any, mockNext)).not.toThrow();
    expect(mockNext).toHaveBeenCalled();
  });
});
