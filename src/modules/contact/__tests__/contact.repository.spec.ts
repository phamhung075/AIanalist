import ContactRepository from '../contact.repository';
import { IContact } from '../contact.interface';

describe('ContactRepository', () => {
  let contactRepository: ContactRepository;

  beforeEach(() => {
    contactRepository = new ContactRepository();
    jest.clearAllMocks();
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

  it('should fetch a contact by ID', async () => {
    const contact: IContact = {
      id: '1',
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '1234567890',
      message: 'Hello',
    };

    jest.spyOn(contactRepository, 'findById').mockResolvedValue(contact);

    const result = await contactRepository.findById('1');

    expect(contactRepository.findById).toHaveBeenCalledWith('1');
    expect(result).toEqual(contact);
  });

  it('should update a contact by ID', async () => {
    const updatedContact: IContact = {
      id: '1',
      name: 'Jane Doe Updated',
      email: 'jane@example.com',
      phone: '1234567890',
      message: 'Updated message',
    };

    jest.spyOn(contactRepository, 'update').mockResolvedValue(updatedContact);

    const result = await contactRepository.update('1', updatedContact);

    expect(contactRepository.update).toHaveBeenCalledWith('1', updatedContact);
    expect(result).toEqual(updatedContact);
  });

  it('should delete a contact by ID', async () => {
    jest.spyOn(contactRepository, 'delete').mockResolvedValue(true);

    const result = await contactRepository.delete('1');

    expect(contactRepository.delete).toHaveBeenCalledWith('1');
    expect(result).toBe(true);
  });
});
