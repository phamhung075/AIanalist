import { Request, Response, NextFunction } from 'express';
import ContactController from '../contact.controller';
import ContactService from '../contact.service';
import { HttpStatusCode } from '@/_core/helper/http-status/common/HttpStatusCode';
import { RestHandler } from '@/_core/helper/http-status/common/RestHandler';
import { IContact } from '../contact.interface';
import ContactRepository from '../contact.repository';

jest.mock('../contact.service');
jest.mock('@/_core/helper/http-status/common/RestHandler');

describe('ContactController', () => {
  let contactController: ContactController;
  let mockContactService: jest.Mocked<ContactService>;
  let mockContactRepository: jest.Mocked<ContactRepository>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    mockContactRepository = new ContactRepository() as jest.Mocked<ContactRepository>;
    mockContactService = new ContactService(mockContactRepository) as jest.Mocked<ContactService>;
    contactController = new ContactController(mockContactService);

    req = {
      params: {},
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    jest.clearAllMocks();
  });

  // ✅ Test createContact
  it('should create a new contact', async () => {
    req.body = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      message: 'Test message',
    };

    const mockContact: IContact = {
      id: '1',
      ...req.body,
    };

    mockContactService.createContact.mockResolvedValue(mockContact);

    await contactController.createContact(req as any, res as Response, next);

    expect(mockContactService.createContact).toHaveBeenCalledWith(req.body);
    expect(RestHandler.success).toHaveBeenCalledWith(req, res, {
      code: HttpStatusCode.CREATED,
      message: 'Contact created successfully',
      data: mockContact,
    });
  });

  it('should handle failure to create a contact', async () => {
    req.body = {
      name: 'Invalid Contact',
    };

    mockContactService.createContact(req.body);

    await contactController.createContact(req as any, res as Response, next);

    expect(mockContactService.createContact).toHaveBeenCalledWith(req.body);
    expect(RestHandler.error).toHaveBeenCalledWith(req, res, {
      code: HttpStatusCode.BAD_REQUEST,
      message: 'Contact creation failed',
    });
  });

  // ✅ Test getAllContacts
  it('should return all contacts', async () => {
    const mockContacts: IContact[] = [
      { id: '1', name: 'John Doe', email: 'john@example.com', phone: '1234567890', message: 'Test' },
    ];

    mockContactService.getAllContacts.mockResolvedValue(mockContacts);

    await contactController.getAllContacts(req as any, res as Response, next);

    expect(mockContactService.getAllContacts).toHaveBeenCalled();
    expect(RestHandler.success).toHaveBeenCalledWith(req, res, {
      code: HttpStatusCode.OK,
      message: 'Get all contacts successfully',
      data: mockContacts,
    });
  });

  it('should handle no contacts found', async () => {
    mockContactService.getAllContacts.mockResolvedValue([]);

    await contactController.getAllContacts(req as any, res as Response, next);

    expect(RestHandler.success).toHaveBeenCalledWith(req, res, {
      code: HttpStatusCode.NO_CONTENT,
      message: 'Get all contacts successfully',
      data: [],
    });
  });

  // ✅ Test getContactById
  it('should return a contact by ID', async () => {
    if (req.params === undefined) {
      throw new Error('Missing required parameter: id');
    }
    req.params.id = '1';

    const mockContact: IContact = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      message: 'Test message',
    };

    mockContactService.getContactById.mockResolvedValue(mockContact);

    await contactController.getContactById(req as any, res as Response, next);

    expect(mockContactService.getContactById).toHaveBeenCalledWith('1');
    expect(RestHandler.success).toHaveBeenCalledWith(req, res, {
      code: HttpStatusCode.OK,
      message: 'Get contact by id successfully',
      data: mockContact,
    });
  });

  it('should return 404 when contact is not found', async () => {
    if (req.params === undefined) {
      throw new Error('Missing required parameter: id');
    }
    req.params.id = '1';

    mockContactService.getContactById.mockResolvedValue(null);

    await contactController.getContactById(req as any, res as Response, next);

    expect(mockContactService.getContactById).toHaveBeenCalledWith('1');
    expect(RestHandler.error).toHaveBeenCalledWith(req, res, {
      code: HttpStatusCode.NOT_FOUND,
      message: 'Contact not found',
    });
  });

  // ✅ Test updateContact
  it('should update a contact', async () => {
    if (req.params === undefined) {
      throw new Error('Missing required parameter: id');
    }
    req.params.id = '1';
    req.body = { name: 'Updated Name' };

    const updatedContact: IContact = {
      id: '1',
      name: 'Updated Name',
      email: 'john@example.com',
      phone: '1234567890',
      message: 'Updated message',
    };

    mockContactService.updateContact.mockResolvedValue(updatedContact);

    await contactController.updateContact(req as any, res as Response, next);

    expect(mockContactService.updateContact).toHaveBeenCalledWith('1', req.body);
    expect(RestHandler.success).toHaveBeenCalledWith(req, res, {
      code: HttpStatusCode.OK,
      message: 'Update contact successfully',
      data: updatedContact,
    });
  });

  // ✅ Test deleteContact
  it('should delete a contact', async () => {
    if (req.params === undefined) {
      throw new Error('Missing required parameter: id');
    }
    req.params.id = '1';

    mockContactService.deleteContact.mockResolvedValue(true);

    await contactController.deleteContact(req as any, res as Response, next);

    expect(mockContactService.deleteContact).toHaveBeenCalledWith('1');
    expect(RestHandler.success).toHaveBeenCalledWith(req, res, {
      code: HttpStatusCode.OK,
      message: 'Delete contact successfully',
    });
  });

  it('should handle delete failure', async () => {
    if (req.params === undefined) {
      throw new Error('Missing required parameter: id');
    }
    req.params.id = '1';

    mockContactService.deleteContact.mockResolvedValue(false);

    await contactController.deleteContact(req as any, res as Response, next);

    expect(mockContactService.deleteContact).toHaveBeenCalledWith('1');
    expect(RestHandler.error).toHaveBeenCalledWith(req, res, {
      code: HttpStatusCode.NOT_FOUND,
      message: 'Contact not found',
    });
  });
});
