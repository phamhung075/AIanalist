import { ErrorController } from './error.controller';
import { ErrorTestService } from './error.service';

const errorTestService = new ErrorTestService();
const controller = new ErrorController(errorTestService);

export {
	controller
};

