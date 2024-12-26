import { Request, Response, NextFunction } from 'express';
import ContactController from '../contact.controller';
import ContactService from '../contact.service';
import { IContact } from '../contact.interface';
import { HttpStatusCode } from '@/_core/helper/http-status/common/HttpStatusCode';



describe('ContactController', () => {
  let contactController: ContactController;
  let mockContactService: jest.Mocked<ContactService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    // Mock the contact service
    mockContactService = {
      createContact: jest.fn(),
      getAllContacts: jest.fn(),
      getContactById: jest.fn(),
      updateContact: jest.fn(),
      deleteContact: jest.fn(),
    } as any;

    // Create controller instance with mocked service
    contactController = new ContactController(mockContactService);

    // Mock request object with typical contact data
    mockRequest = {
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        message: 'Test message'
      },
      startTime: Date.now() // Mock the startTime for response time calculation
    } as any;

    // Mock response object with all necessary methods
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn(),
      locals: {
        startTime: Date.now()
      },
      headersSent: false
    } as Partial<Response>;

    // Mock next function
    mockNext = jest.fn();
  });

  describe('createContact', () => {
    const mockContactData: IContact = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      message: 'Test message'
    };

    it('should successfully create a contact and return proper success response', async () => {
      // Setup service mock to return contact data
      mockContactService.createContact.mockResolvedValue(mockContactData);

      // Execute controller method
      await contactController.createContact(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verify service was called with correct data
      expect(mockContactService.createContact).toHaveBeenCalledWith({
        name: mockRequest.body.name,
        email: mockRequest.body.email,
        phone: mockRequest.body.phone,
        message: mockRequest.body.message
      });

      // Verify response status
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.CREATED);

      // Verify response headers
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'X-Response-Time',
        expect.stringMatching(/^\d+ms$/)
      );

      // Verify response body structure
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Contact created successfully',
          data: mockContactData,
          metadata: expect.objectContaining({
            timestamp: expect.any(String),
            responseTime: expect.stringMatching(/^\d+ms$/)
          })
        })
      );
    });

    it('should let error propagate to error handling middleware', async () => {
      // Setup service mock to throw error
      const mockError = new Error('Database error');
      mockContactService.createContact.mockRejectedValue(mockError);

      // Execute controller method
      await expect(
        contactController.createContact(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        )
      ).rejects.toThrow(mockError);

      // Verify service was called
      expect(mockContactService.createContact).toHaveBeenCalled();
      
      // Verify response was not sent since error will be handled by middleware
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('should handle missing required fields', async () => {
      // Setup request with missing fields
      mockRequest.body = {
        name: 'John Doe'
        // Missing email, phone, and message
      };

      // Execute controller method
      await contactController.createContact(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verify service was called with partial data
      expect(mockContactService.createContact).toHaveBeenCalledWith({
        name: 'John Doe',
        email: undefined,
        phone: undefined,
        message: undefined
      });
    });

    it('should not send response if headers are already sent', async () => {
      // Mock headers already sent
      mockResponse.headersSent = true;
      mockContactService.createContact.mockResolvedValue(mockContactData);

      // Execute controller method
      await contactController.createContact(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verify json response was not called
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });
});