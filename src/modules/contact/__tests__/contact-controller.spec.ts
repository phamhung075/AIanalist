import { Request, Response, NextFunction } from 'express';
import ContactController from '../contact.controller';
import ContactService from '../contact.service';


jest.mock('@/_core/helper/http-status/common/RestHandler', () => ({
 RestHandler: {
   success: jest.fn()
 }
}));

describe('ContactController', () => {
  let contactController: ContactController;
  let mockContactService: jest.Mocked<ContactService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockContactService = {
      createContact: jest.fn(),
      getAllContacts: jest.fn(),
      getContactById: jest.fn(),
      updateContact: jest.fn(),
      deleteContact: jest.fn(),
    } as any;

    mockNext = jest.fn();
   
    contactController = new ContactController(mockContactService);

    mockRequest = {
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        message: 'Test message'
      },
      method: 'POST',
      originalUrl: '/contacts'
    } as any;

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      req: mockRequest,
      headersSent: false
    } as Partial<Response>;

    jest.clearAllMocks();
  })
})