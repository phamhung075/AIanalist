import { IContact } from '../contact.interface';
import ContactService from '../contact.service';

jest.mock('@/_core/helper/http-status/common/RestHandler', () => ({
  RestHandler: {
    success: jest.fn(),
  },
}));

describe('ContactController', () => {
  let mockContactService: jest.Mocked<ContactService>;

  beforeEach(() => {
    mockContactService = {
      createContact: jest.fn(),
      getAllContacts: jest.fn(),
      getContactById: jest.fn(),
      updateContact: jest.fn(),
      deleteContact: jest.fn(),
    } as unknown as jest.Mocked<ContactService>;

    jest.clearAllMocks();
  });

  it('should call createContact successfully', async () => {
    const mockContact : IContact = { id: "1", name: 'John Doe',  email: 'john@example.com', phone: '1234567890' };
    mockContactService.createContact.mockResolvedValue(mockContact);

    const result = await mockContactService.createContact(mockContact);

    expect(mockContactService.createContact).toHaveBeenCalledWith(mockContact);
    expect(result).toEqual(mockContact);
  });

  it('should call getAllContacts successfully', async () => {
    const mockContacts = [{ id: "1", name: 'John Doe',  email: 'john@example.com', phone: '1234567890' }];
    mockContactService.getAllContacts.mockResolvedValue(mockContacts);

    const result = await mockContactService.getAllContacts();

    expect(mockContactService.getAllContacts).toHaveBeenCalled();
    expect(result).toEqual(mockContacts);
  });
});
