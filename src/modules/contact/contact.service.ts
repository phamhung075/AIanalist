// contact.service.ts

import { Service } from 'typedi';
import { BaseService } from '../_base/crud/BaseService';
import { IContact } from './contact.interface';
import ContactRepository from './contact.repository';



@Service('ContactService')
class ContactService extends BaseService<IContact> {
    constructor(contactRepository: ContactRepository) {
        super(contactRepository);
    }
}

export default ContactService;