// contact.controller.ts
import { Request, Response } from 'express';
import ContactService from './contact.service';

class ContactController {
  constructor(private contactService: ContactService) {}

  async createContact(req: Request, res: Response) {
    const contact = await this.contactService.createContact(req.body);
    res.status(201).json(contact);
  }

  async getAllContacts(_req: Request, res: Response) {
    const contacts = await this.contactService.getAllContacts();
    res.status(200).json(contacts);
  }

  async getContactById(req: Request, res: Response) {
    const contact = await this.contactService.getContactById(req.params.id);
    res.status(contact ? 200 : 404).json(contact || { message: 'Contact not found' });
  }

  async updateContact(req: Request, res: Response) {
    const contact = await this.contactService.updateContact(req.params.id, req.body);
    res.status(contact ? 200 : 404).json(contact || { message: 'Contact not found' });
  }

  async deleteContact(req: Request, res: Response) {
    await this.contactService.deleteContact(req.params.id);
    res.status(204).send();
  }
}

export default ContactController;
