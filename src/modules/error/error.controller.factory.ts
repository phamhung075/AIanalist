import { ErrorController } from './error.controller';
import { ErrorTestService } from './error.service';

const errorTestService = new ErrorTestService();
const errorController = new ErrorController(errorTestService);

export default errorController

