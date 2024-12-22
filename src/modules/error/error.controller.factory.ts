import { ErrorController } from './error.controller';
import ErrorRepository from './error.repository';
import ErrorService from './error.service';
const errorRepository = new ErrorRepository();
const errorService = new ErrorService(errorRepository);
const errorController = new ErrorController(errorService);

export default errorController

