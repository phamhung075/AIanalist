
const contactController = require('../../src/modules/contact/contact.handle');
describe('ContactController', () => {
  let mockRequest: any;
  let mockResponse: any;
  let mockNext: any;

  beforeEach(() => {
    mockRequest = {
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890'
      },
      method: 'POST',
      originalUrl: '/contact'
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      req: mockRequest,
      headersSent: false
    };
    
    mockNext = jest.fn();
  });

  describe('createContact', () => {
    it('should successfully create a contact and return proper success response', async () => {
      await contactController.createContact(mockRequest, mockResponse, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          statusCode: expect.any(String),
          methode: 'POST',
          path: '/contact'
        })
      );
    });

    it('should let error propagate to error handling middleware', async () => {
      mockRequest.body = null;
      await contactController.createContact(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle missing required fields', async () => {
      delete mockRequest.body.name;
      await contactController.createContact(mockRequest, mockResponse, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false
        })
      );
    });

    it('should not send response if headers are already sent', async () => {
      mockResponse.headersSent = true;
      await contactController.createContact(mockRequest, mockResponse, mockNext);
      
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });
});