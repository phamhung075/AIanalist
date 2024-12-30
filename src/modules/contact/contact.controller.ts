import { Service } from 'typedi';
import ContactService from './contact.service';
import { IContact } from './contact.interface';
import { CreateInput, UpdateInput } from './contact.dto';
import { BaseController } from '../_base/crud/BaseController';

@Service()
class ContactController extends BaseController<IContact, CreateInput, UpdateInput> {
  constructor(service: ContactService) {
    super(service);
  }  
}

export default ContactController;
