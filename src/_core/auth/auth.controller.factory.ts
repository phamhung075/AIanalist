// auth.controller.factory.ts
import ContactService from '@/modules/contact/contact.service';
import AuthController from './auth.controller';
import AuthService from './auth.service';
import ContactRepository from '@/modules/contact/contact.repository';
import AuthRepository from './auth.repository';

const authRepository = new AuthRepository();
const contactRepository = new ContactRepository();
const contactService = new ContactService(contactRepository);
const authService = new AuthService(authRepository, contactService);
const authController = new AuthController(authService);

export default authController;


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
