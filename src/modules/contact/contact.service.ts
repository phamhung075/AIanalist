// contact.service.ts
import ContactRepository from './contact.repository';
import { IContact } from './contact.interface';
import { Service } from 'typedi';

@Service()
class ContactService {
  constructor(private readonly contactRepository: ContactRepository) {}

  async createContact(contact: IContact): Promise<IContact | false> {
    return await this.contactRepository.create(contact);
  }

  async createWithId(id: string, contact: IContact): Promise<IContact> {
    return await this.contactRepository.createWithId(id, contact);
  }

  async getAllContacts(): Promise<IContact[]> {
    return await this.contactRepository.findAll();
  }

  async getContactById(id: string): Promise<Partial<IContact> | null> {
    return await this.contactRepository.findById(id);
  }

  async updateContact(id: string, updates: Partial<IContact>): Promise<IContact | null> {
    return await this.contactRepository.update(id, updates);
  }

  async deleteContact(id: string): Promise<boolean> {
    return await this.contactRepository.delete(id);
  }
}

export default ContactService;
