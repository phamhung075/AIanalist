// __tests__/contact.middleware.spec.ts
import { validateSchema } from '../contact.middleware';
// import { Request, Response, NextFunction } from 'express';
import { CreateContactSchema } from '../contact.validation';

describe('Contact Middleware - validateSchema', () => {
  it('should pass validation', () => {
    const mockRequest = { body: { name: 'John', email: 'john@example.com', phone: '1234567890' } };
    const mockResponse = {};
    const mockNext = jest.fn();

    expect(() => validateSchema(CreateContactSchema)(mockRequest as any, mockResponse as any, mockNext)).not.toThrow();
    expect(mockNext).toHaveBeenCalled();
  });
});