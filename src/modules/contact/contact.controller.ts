// contact.controller.ts
import { NextFunction, RequestHandler, Response } from 'express';
import { IContact } from './contact.interface';
import ContactService from './contact.service';
import _SUCCESS from '@/_core/helper/http-status/success';
import { RestHandler } from '@/_core/helper/http-status/common/RestHandler';
import { HttpStatusCode } from '@/_core/helper/http-status/common/HttpStatusCode';
import { CustomRequest } from '@/_core/helper/interfaces/CustomRequest.interface';

class ContactController {
  constructor(private contactService: ContactService) { }

  createContact: RequestHandler = async (req: CustomRequest, res: Response, _next: NextFunction) => {
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

    const { name, email, phone, message } = req.body;

    const inputData: Partial<IContact> = {
      name,
      email,
      phone,
      message,
    };

    const contact = await this.contactService.updateContact(req.params.id, inputData);

    if (!contact) {
      return RestHandler.error(req, res, {
        code: HttpStatusCode.NOT_FOUND,
        message: 'Contact not found',
      });
    }

    const messageSuccess = 'Update contact successfully';

    return RestHandler.success(req, res, {
      code: HttpStatusCode.OK,
      message: messageSuccess,
      data: contact,
    });
  };


  deleteContact = async (req: CustomRequest, res: Response, _next: NextFunction) => {
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
