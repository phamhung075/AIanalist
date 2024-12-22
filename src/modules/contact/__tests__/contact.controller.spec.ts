// __tests__/contact.controller.spec.ts

import ContactController from '../contact.controller';
import ContactService from '../contact.service';
import { Request, Response } from 'express';

describe('ContactController', () => {
  let contactController: ContactController;
  let mockContactService: jest.Mocked<ContactService>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockContactService = {
      createContact: jest.fn(),
      getAllContacts: jest.fn(),
      getContactById: jest.fn(),
      updateContact: jest.fn(),
      deleteContact: jest.fn(),
    } as any;

    contactController = new ContactController(mockContactService);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn(), // Mock setHeader explicitly
    };
  });

  it('should create a new contact', async () => {
    const mockRequest = { body: { name: 'John' } } as Request;

    (mockContactService.createContact as jest.Mock).mockResolvedValue({
      id: '1',
      name: 'John',
      email: 'john@example.com',
      phone: '1234567890',
      message: 'Hello, this is a test message.',
    });

    await contactController.createContact(
      mockRequest,
      mockResponse as Response,
      jest.fn()
    );

    expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Response-Time', expect.any(String));
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      message: 'Contact created successfully',
      data: {
        id: '1',
        name: 'John',
        email: 'john@example.com',
        phone: '1234567890',
        message: 'Hello, this is a test message.',
      },
      metadata: expect.objectContaining({
        timestamp: expect.any(String),
        responseTime: expect.any(String),
      }),
    });
  });
});
