import { Service } from 'typedi';
import { BaseController } from '../_base/crud/BaseController';
import { CreateInput, UpdateInput } from './contact.dto';
import { IContact } from './contact.interface';
import ContactService from './contact.service';



@Service('ContactController')
class ContactController extends BaseController<IContact, CreateInput, UpdateInput> {
    constructor(contactService: ContactService) {
        super(contactService);
    }
}

export default ContactController;
