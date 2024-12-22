// __tests__/contact.service.spec.ts
import ContactService from '../contact.service';
import ContactRepository from '../contact.repository';

describe('ContactService', () => {
  let contactService: ContactService;
  let mockContactRepository: jest.Mocked<ContactRepository>;

  beforeEach(() => {
    mockContactRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    contactService = new ContactService(mockContactRepository);
  });

  it('should create a new contact', async () => {
    const contactData = { name: 'John', email: 'john@example.com', phone: '1234567890' };
    mockContactRepository.create.mockResolvedValue({ id: '1', ...contactData });

    const result = await contactService.createContact(contactData);

    expect(mockContactRepository.create).toHaveBeenCalledWith(contactData);
    expect(result).toEqual({ id: '1', ...contactData });
  });

  it('should fetch all contacts', async () => {
    const contacts = [{ id: '1', name: 'John', email: 'john@example.com', phone: '1234567890' }];
    mockContactRepository.findAll.mockResolvedValue(contacts);

    const result = await contactService.getAllContacts();

    expect(mockContactRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(contacts);
  });
});
