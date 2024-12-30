// auth.controller.factory.ts
import ContactService from '@/modules/contact/contact.service';
import AuthController from './auth.controller';
import AuthService from './auth.service';
import ContactRepository from '@/modules/contact/contact.repository';
import AuthRepository from './auth.repository';

const authController = new AuthController(
    new AuthService(
      new AuthRepository(),
      new ContactService(new ContactRepository())
    )
);

export default authController;
