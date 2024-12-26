import { z } from 'zod';
import { ErrorResponse } from '../../http-status/error';
import { HttpStatusCode } from '../../http-status/common/HttpStatusCode';
import { validateSchema } from '..';

describe('validateSchema', () => {
  const testSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    age: z.number().min(18)
  });

  let mockRequest: any;

  beforeEach(() => {
    mockRequest = {
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        age: 25
      }
    };
  });

  it('should pass validation with valid data', () => {
    expect(() => validateSchema(testSchema)(mockRequest)).not.toThrow();
  });

  it('should throw ErrorResponse with invalid data', () => {
    mockRequest.body.email = 'invalid-email';
    
    try {
      validateSchema(testSchema)(mockRequest);
      fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorResponse);
      expect((error as ErrorResponse).status).toBe(HttpStatusCode.BAD_REQUEST);
      expect((error as ErrorResponse).message).toBe('Validation Error');
      expect((error as ErrorResponse).errors).toEqual([
        expect.objectContaining({
          field: 'email',
          message: expect.any(String)
        })
      ]);
    }
  });

  it('should handle multiple validation errors', () => {
    mockRequest.body = {
      name: 'J',
      email: 'invalid',
      age: 15
    };

    try {
      validateSchema(testSchema)(mockRequest);
      fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorResponse);
      expect((error as ErrorResponse).errors).toHaveLength(3);
    }
  });

  it('should handle non-Zod errors', () => {
    const error = new Error('Test error');
    jest.spyOn(testSchema, 'parse').mockImplementation(() => {
      throw error;
    });

    expect(() => validateSchema(testSchema)(mockRequest))
      .toThrow(error);
  });

  it('should handle nested field validation errors', () => {
    const nestedSchema = z.object({
      user: z.object({
        profile: z.object({
          name: z.string().min(2)
        })
      })
    });

    mockRequest.body = {
      user: {
        profile: {
          name: 'A'
        }
      }
    };

    try {
        validateSchema(nestedSchema)(mockRequest);
        fail('Should have thrown an error');
        } catch (error) {
        expect(error).toBeInstanceOf(ErrorResponse);
        const errorResponse = error as ErrorResponse;
        expect(errorResponse?.errors?.[0]?.field).toBe('user.profile.name');
    }
  });
});