// contact.controller.factory.ts
import ContactController from './contact.controller';
import ContactService from './contact.service';
import ContactRepository from './contact.repository';

const contactRepository = new ContactRepository();
const contactService = new ContactService(contactRepository);
const contactController = new ContactController(contactService);

export default contactController;
