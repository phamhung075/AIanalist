// contact.service.ts
import ContactRepository from './contact.repository';
import { IContact } from './contact.interface';

class ContactService {
  constructor(private contactRepository: ContactRepository) {}

  async createContact(contact: IContact): Promise<IContact> {
    return await this.contactRepository.create(contact);
  }

  async getAllContacts(): Promise<IContact[]> {
    return await this.contactRepository.findAll();
  }

  async getContactById(id: string): Promise<IContact | null> {
    return await this.contactRepository.findById(id);
  }

  async updateContact(id: string, updates: Partial<IContact>): Promise<IContact | null> {
    return await this.contactRepository.update(id, updates);
  }

  async deleteContact(id: string): Promise<void> {
    await this.contactRepository.delete(id);
  }
}

export default ContactService;
