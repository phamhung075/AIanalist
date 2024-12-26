// contact.controller.ts
import { CustomRequest } from '@/_core/guard/handle-permission/user-context.interface';
import { NextFunction, RequestHandler, Response } from 'express';
import { IContact } from './contact.interface';
import ContactService from './contact.service';
import _SUCCESS from '@/_core/helper/http-status/success';
import { RestHandler } from '@/_core/helper/http-status/common/RestHandler';
import { HttpStatusCode } from '@/_core/helper/http-status/common/HttpStatusCode';

class ContactController {
  constructor(private contactService: ContactService) { }

  createContact: RequestHandler = async (req: CustomRequest, res: Response, _next: NextFunction) => {
    console.log('level Controller');
    const body = req.body;
    const inputData = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      message: body.message,
    } as IContact
    const contact = await this.contactService.createContact(inputData);
    const message = 'Contact created successfully';
    // return new _SUCCESS.SuccessResponse({ message, data: contact }).send(res);
    return RestHandler.success(req, res, {
      code: HttpStatusCode.CREATED,
      message,
      data: contact
    });
  }

  getAllContacts = async (_req: CustomRequest, res: Response, _next: NextFunction) => {
    console.log('level Controller');
    const contacts = await this.contactService.getAllContacts();
    const message = 'Get all contacts successfully';
    new _SUCCESS.SuccessResponse({ message, data: contacts }).send(res);
  }

  getContactById = async (req: CustomRequest, res: Response, _next: NextFunction) => {
    console.log('level Controller');
    const contact = await this.contactService.getContactById(req.params.id);
    const message = 'Get contact by id successfully';
    new _SUCCESS.SuccessResponse({ message, data: contact }).send(res);
  }

  updateContact = async (req: CustomRequest, res: Response, _next: NextFunction) => {
    console.log('level Controller');
    const body = req.body;
    const inputData = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      message: body.message,
    } as IContact
    const contact = await this.contactService.updateContact(req.params.id, inputData);
    const message = 'Update contact successfully';
    new _SUCCESS.SuccessResponse({ message, data: contact }).send(res);
  }

  deleteContact = async (req: CustomRequest, res: Response, _next: NextFunction) => {
    console.log('level Controller');
    await this.contactService.deleteContact(req.params.id);
    const message = 'Delete contact successfully';
    new _SUCCESS.SuccessResponse({ message }).send(res);
  }
}

export default ContactController;
