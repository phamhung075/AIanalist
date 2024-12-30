// contact.controller.ts
import { HttpStatusCode } from '@/_core/helper/http-status/common/HttpStatusCode';
import { RestHandler } from '@/_core/helper/http-status/common/RestHandler';
import _ERROR from '@/_core/helper/http-status/error';
import { CustomRequest } from '@/_core/helper/interfaces/CustomRequest.interface';
import { NextFunction, RequestHandler, Response } from 'express';
import { Service } from 'typedi';
import { ContactIdInput, CreateContactInput } from './contact.dto';
import { IContact } from './contact.interface';
import ContactService from './contact.service';

@Service()
class ContactController {
  constructor(private readonly contactService: ContactService) { }

  createContact: RequestHandler = async (req: CustomRequest, res: Response, _next: NextFunction) => {
    const body = req.body;
    const inputData = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      address: body.address,
      postalCode: body.postalCode,
      city: body.city,
      country: body.country,
      message: body.message,
    } as CreateContactInput
    const contact = await this.contactService.createContact(inputData);
    if (!contact) {
      throw new _ERROR.BadRequestError({
        message: 'Contact creation failed'
      });
    }

    const message = 'Contact created successfully';
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
      throw new _ERROR.NotFoundError({
        message: 'Contacts not found'
      });
    }

    return RestHandler.success(req, res, {
      code: HttpStatusCode.OK,
      message,
      data: contacts,
    });
  };

  getContactById = async (req: CustomRequest, res: Response, _next: NextFunction) => {
    const params = req.params;
    const { id } = {
      id: params.id,
    } as ContactIdInput

    const contact = await this.contactService.getContactById(id);
    if (!contact) {
      throw new _ERROR.NotFoundError({
        message: 'Contact not found'
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
    const body = req.body;
    const inputData = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      address: body.address,
      postalCode: body.postalCode,
      city: body.city,
      country: body.country,
      message: body.message,
    } as IContact

    const contact = await this.contactService.updateContact(req.params.id, inputData);

    if (!contact) {
      throw new _ERROR.NotFoundError({
        message: 'Contact not found'
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
      throw new _ERROR.NotFoundError({
        message: 'Contact not found'
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
