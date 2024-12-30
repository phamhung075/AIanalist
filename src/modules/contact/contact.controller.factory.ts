// contact.controller.factory.ts
import ContactController from './contact.controller';
import ContactService from './contact.service';
import ContactRepository from './contact.repository';

const contactController = new ContactController(
    new ContactService(new ContactRepository())
);

export default contactController;
