import { Container } from 'typedi';
import ContactController from './contact.controller';
import ContactService from './contact.service';
import ContactRepository from './contact.repository';

class ContactModule {
    public contactController: ContactController;
    public contactService: ContactService;
    public contactRepository: ContactRepository;

    constructor() {
        this.contactController = Container.get(ContactController);
        this.contactService = Container.get(ContactService);
        this.contactRepository = Container.get(ContactRepository);
    }
}

const contactModule = new ContactModule();

export const { contactController, contactService, contactRepository } = contactModule;