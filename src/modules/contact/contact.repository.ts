// contact.repository.ts
import { Service } from 'typedi';
import { BaseRepository } from '../_base/crud/BaseRepository';
import { IContact } from './contact.interface';


@Service('ContactRepository')
class ContactRepository extends BaseRepository<IContact> {
    constructor() {
        super('contacts');
    }
}

export default ContactRepository;
