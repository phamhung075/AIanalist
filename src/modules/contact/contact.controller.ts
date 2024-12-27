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
    if (!contact) {
      return RestHandler.error(req, res, {
        code: HttpStatusCode.BAD_REQUEST,
        message: 'Contact creation failed'
      });
    }
    const message = 'Contact created successfully';
    // return new _SUCCESS.SuccessResponse({ message, data: contact }).send(res);
    return RestHandler.success(req, res, {
      code: HttpStatusCode.CREATED,
      message,
      data: contact
    });
  }

  getAllContacts = async (req: CustomRequest, res: Response, _next: NextFunction) => {
    console.log('level Controller');
    const contacts = await this.contactService.getAllContacts();
    const message = 'Get all contacts successfully';

    if (!contacts || contacts.length === 0) {
      return RestHandler.success(req, res, {
        code: HttpStatusCode.NO_CONTENT,
        message,
        data: [],
      });
    }

    return RestHandler.success(req, res, {
      code: HttpStatusCode.OK,
      message,
      data: contacts,
    });
  };

  getContactById = async (req: CustomRequest, res: Response, _next: NextFunction) => {
    console.log('level Controller');
    const contact = await this.contactService.getContactById(req.params.id);
    if (!contact) {
      return RestHandler.error(req, res, {
        code: HttpStatusCode.NOT_FOUND,
        message: 'Contact not found',
      });
    }
    const message = contact
      ? 'Get contact by id successfully'
      : 'Contact not found';

    return RestHandler.success(req, res, {
      code: contact ? HttpStatusCode.OK : HttpStatusCode.NOT_FOUND,
      message,
      data: contact, // Ensure data is undefined if contact is null
    });
  };

  updateContact = async (req: CustomRequest, res: Response, _next: NextFunction) => {
  console.log('level Controller');
  const body = req.body;
  const inputData = {
    name: body.name,
    email: body.email,
    phone: body.phone,
    message: body.message,
  } as IContact;

    const contact = await this.contactService.updateContact(req.params.id, inputData);
    if (!contact) {
      return RestHandler.error(req, res, {
        code: HttpStatusCode.NOT_FOUND,
        message: 'Contact not found',
      });
    }
    const message = 'Update contact successfully';

    return RestHandler.success(req, res, {
      code: HttpStatusCode.OK,
      message,
      data: contact,
    });
  };

  deleteContact = async (req: CustomRequest, res: Response, _next: NextFunction) => {
    console.log('level Controller');
    const result = await this.contactService.deleteContact(req.params.id);

    if (!result) {
      return RestHandler.error(req, res, {
        code: HttpStatusCode.NOT_FOUND,
        message: 'Contact not found',
      });
    }

    const message = 'Delete contact successfully';

    return RestHandler.success(req, res, {
      code: HttpStatusCode.OK,
      message,
    });
  };
}

export default ContactController;
