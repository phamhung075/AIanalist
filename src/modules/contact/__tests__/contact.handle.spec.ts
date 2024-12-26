import { validateSchema } from '@/_core/helper/validateZodSchema';
import { CreateContactSchema } from '../contact.validation';

describe('Contact Validation Tests', () => {
  let mockRequest: any;

  beforeEach(() => {
    mockRequest = {
      startTime: Date.now(),
      body: {
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '1234567890'
      }
    };
  });

  describe('validateSchema', () => {
    it('should pass with valid contact data', () => {
      expect(() => validateSchema(CreateContactSchema)(mockRequest)).not.toThrow();
    });

    it('should fail with missing name', () => {
      delete mockRequest.body.name;
      expect(() => validateSchema(CreateContactSchema)(mockRequest)).toThrow();
    });

    it('should fail with invalid email', () => {
      mockRequest.body.email = 'invalid-email';
      expect(() => validateSchema(CreateContactSchema)(mockRequest)).toThrow();
    });

    it('should fail with invalid phone', () => {
      mockRequest.body.phone = '123';
      expect(() => validateSchema(CreateContactSchema)(mockRequest)).toThrow();
    });

    it('should fail with empty body', () => {
      mockRequest.body = {};
      expect(() => validateSchema(CreateContactSchema)(mockRequest)).toThrow();
    });

    it('should reject additional properties', () => {
      mockRequest.body.extraField = 'extra';
      expect(() => validateSchema(CreateContactSchema)(mockRequest)).toThrow();
    });
  });
});