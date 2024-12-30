// contact.service.ts
import ContactRepository from './contact.repository';
import { IContact } from './contact.interface';
import { Service } from 'typedi';
import { BaseService } from '../_base/crud/BaseService';

@Service()
class ContactService extends BaseService<IContact> {
  constructor(repository: ContactRepository) {
    super(repository);
  }

  // ✅ You can add Contact-specific methods here
  // async getContactsByStatus(status: string): Promise<IContact[]> {
  //   const allContacts = await this.getAll();
  //   return allContacts.filter((contact) => contact.status === status);
}

export default ContactService;