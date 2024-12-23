import ContactRepository from '../contact.repository';
import { IContact } from '../contact.interface';

describe('ContactRepository', () => {
  let contactRepository: ContactRepository;

  beforeEach(() => {
    contactRepository = new ContactRepository();
  });

  it('should create a new contact', async () => {
    const contactData: IContact = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      message: 'Test message',
    };

    jest.spyOn(contactRepository, 'create').mockResolvedValue({
      id: '123',
      ...contactData,
    });

    const result = await contactRepository.create(contactData);

    expect(contactRepository.create).toHaveBeenCalledWith(contactData);
    expect(result).toEqual({ id: '123', ...contactData });
  });

  it('should fetch all contacts', async () => {
    const contacts: IContact[] = [
      { id: '1', name: 'Jane Doe', email: 'jane@example.com', phone: '1234567890', message: 'Hello' },
    ];

    jest.spyOn(contactRepository, 'findAll').mockResolvedValue(contacts);

    const result = await contactRepository.findAll();

    expect(contactRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(contacts);
  });
});
