import { IContact } from "../contact.interface";
import ContactService from "../contact.service";


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
    const mockContact: IContact = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
    };

    mockContactService.createContact.mockResolvedValue(mockContact);

    const result = await mockContactService.createContact(mockContact);

    expect(mockContactService.createContact).toHaveBeenCalledWith(mockContact);
    expect(result).toEqual(mockContact);
  });

  it('should call getAllContacts successfully', async () => {
    const mockContacts: IContact[] = [
      { id: '1', name: 'John Doe', email: 'john@example.com', phone: '1234567890' },
    ];

    mockContactService.getAllContacts.mockResolvedValue(mockContacts);

    const result = await mockContactService.getAllContacts();

    expect(mockContactService.getAllContacts).toHaveBeenCalled();
    expect(result).toEqual(mockContacts);
  });

  it('should call getContactById successfully', async () => {
    const mockContact: IContact = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
    };

    mockContactService.getContactById.mockResolvedValue(mockContact);

    const result = await mockContactService.getContactById('1');

    expect(mockContactService.getContactById).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockContact);
  });

  it('should call updateContact successfully', async () => {
    const updatedContact: IContact = {
      id: '1',
      name: 'John Doe Updated',
      email: 'john@example.com',
      phone: '1234567890',
    };

    mockContactService.updateContact.mockResolvedValue(updatedContact);

    const result = await mockContactService.updateContact('1', updatedContact);

    expect(mockContactService.updateContact).toHaveBeenCalledWith('1', updatedContact);
    expect(result).toEqual(updatedContact);
  });

  it('should call deleteContact successfully', async () => {
    mockContactService.deleteContact.mockResolvedValue(true);

    const result = await mockContactService.deleteContact('1');

    expect(mockContactService.deleteContact).toHaveBeenCalledWith('1');
    expect(result).toBe(true);
  });
});
