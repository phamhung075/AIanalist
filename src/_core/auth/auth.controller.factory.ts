// auth.controller.factory.ts
import { contactService } from '@/modules/contact/contact.controller.factory';
import AuthController from './auth.controller';
import AuthRepository from './auth.repository';
import AuthService from './auth.service';

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository, contactService);
const authController = new AuthController(authService);

export {
    authController,
    authService,
    authRepository
};


/*Use the first approach. It provides better debugging, reusability of instances, and clearer dependency tracking. 
The small increase in verbosity is worth these benefits in a professional codebase.

// First approach - Multiple lines, clearer dependencies
const authRepository = new AuthRepository();
const contactRepository = new ContactRepository();
const contactService = new ContactService(contactRepository);
const authService = new AuthService(authRepository, contactService);
const authController = new AuthController(authService);

// Second approach - Nested instantiation
const authController = new AuthController(
    new AuthService(
      new AuthRepository(),
      new ContactService(new ContactRepository())
    )
);


*/
