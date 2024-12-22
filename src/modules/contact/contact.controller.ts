// contact.controller.ts
import { NextFunction, Request, RequestHandler, Response } from 'express';
import ContactService from './contact.service';
import { ExtendedFunctionRequest } from '@/_core/guard/handle-permission/user-context.interface';
import { IContact } from './contact.interface';
import _SUCCESS from '@/_core/helper/async-handler/success';

class ContactController {
  constructor(private contactService: ContactService) {}

  createContact: RequestHandler = async (req: ExtendedFunctionRequest, res: Response, _next: NextFunction) => {
    console.log('level Controller');
    const body = req.body;
    const inputData = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      message: body.message,  
    } as IContact
    const contact = await this.contactService.createContact(inputData);
    console.log(contact);
    const message = 'Contact created successfully';
    new _SUCCESS.SuccessResponse({message, data: contact}).setResponseTime(req.startTime).send(res);
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
