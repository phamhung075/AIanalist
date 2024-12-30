import { z, ZodError } from 'zod';
import { ErrorResponse } from '../../http-status/error';
import { HttpStatusCode } from '../../http-status/common/HttpStatusCode';
import { validateSchema } from '..';

describe('validateSchema', () => {
  const testSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    age: z.number().min(18, 'Age must be at least 18'),
  });

  let mockRequest: any;

  beforeEach(() => {
    mockRequest = {
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        age: 25,
      },
    };
  });

  // ✅ Test Case 1: Valid Data
  it('should pass validation with valid data', () => {
    expect(() => validateSchema(testSchema)(mockRequest)).not.toThrow();
  });

  // ✅ Test Case 2: Invalid Email
  it('should throw ErrorResponse with invalid email', () => {
    mockRequest.body.email = 'invalid-email';

    try {
      validateSchema(testSchema)(mockRequest);
      fail('Should have thrown an ErrorResponse');
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorResponse);
      expect((error as ErrorResponse).status).toBe(HttpStatusCode.BAD_REQUEST);
      expect((error as ErrorResponse).message).toBe('Validation Error');
      expect((error as ErrorResponse).errors).toEqual([
        expect.objectContaining({
          field: 'email',
          message: 'Invalid email format',
        }),
      ]);
    }
  });

  // ✅ Test Case 3: Multiple Validation Errors
  it('should handle multiple validation errors', () => {
    mockRequest.body = {
      name: 'J',
      email: 'invalid',
      age: 15,
    };

    try {
      validateSchema(testSchema)(mockRequest);
      fail('Should have thrown an ErrorResponse');
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorResponse);
      expect((error as ErrorResponse).status).toBe(HttpStatusCode.BAD_REQUEST);
      expect((error as ErrorResponse).errors).toHaveLength(3);
      expect((error as ErrorResponse).errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'name', message: 'Name must be at least 2 characters' }),
          expect.objectContaining({ field: 'email', message: 'Invalid email format' }),
          expect.objectContaining({ field: 'age', message: 'Age must be at least 18' }),
        ])
      );
    }
  });

  // ✅ Test Case 4: Non-Zod Errors
  it('should handle non-Zod errors', () => {
    const error = new Error('Test error');
    jest.spyOn(testSchema, 'parse').mockImplementation(() => {
      throw error;
    });

    expect(() => validateSchema(testSchema)(mockRequest)).toThrow(error);
  });

  // ✅ Test Case 5: Nested Field Validation Errors
  it('should handle nested field validation errors', () => {
    const nestedSchema = z.object({
      user: z.object({
        profile: z.object({
          name: z.string().min(2, 'Name must be at least 2 characters'),
        }),
      }),
    });

    mockRequest.body = {
      user: {
        profile: {
          name: 'A',
        },
      },
    };

    try {
      validateSchema(nestedSchema)(mockRequest);
      fail('Should have thrown an ErrorResponse');
    } catch (error) {
      // Ensure the error is an instance of ErrorResponse
      expect(error).toBeInstanceOf(ErrorResponse);
      
      const errorResponse = error as ErrorResponse;
    
      // Ensure the status code is correct
      expect(errorResponse.status).toBe(HttpStatusCode.BAD_REQUEST);
    
      // Check if errors exist and have valid entries
      expect(errorResponse.errors).toBeDefined();
      expect(Array.isArray(errorResponse.errors)).toBe(true);
      expect(errorResponse.errors?.length).toBeGreaterThan(0);
    
      // Safely access the first error using optional chaining
      const firstError = errorResponse.errors?.[0];
    
      expect(firstError).toBeDefined(); // Ensure there's at least one error
      expect(firstError?.field).toBe('user.profile.name');
      expect(firstError?.message).toBe('Name must be at least 2 characters');
    }
  });

  // ✅ Test Case 6: Missing Required Field
  it('should handle missing required fields', () => {
    mockRequest.body = {
      email: 'valid@example.com',
      age: 25,
    };

    try {
      validateSchema(testSchema)(mockRequest);
      fail('Should have thrown an ErrorResponse');
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorResponse);
    
      const errorResponse = error as ErrorResponse;
    
      // Ensure errors exist and are not empty
      expect(errorResponse.errors).toBeDefined();
      expect(Array.isArray(errorResponse.errors)).toBe(true);
      expect(errorResponse.errors!.length).toBeGreaterThan(0);
    
      // Access the first error safely
      const firstError = errorResponse.errors?.[0];
      expect(firstError).toBeDefined();
      expect(firstError?.field).toBe('user.profile.name');
      expect(firstError?.message).toBe('Name must be at least 2 characters');
    }
  });
});
