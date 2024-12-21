import { ErrorController } from './error.controller';
import { ErrorTestService } from './error.service';

const errorTestService = new ErrorTestService();
const errorTestCloudService = new ErrorController(errorTestService);

export {
	errorTestService,
	errorTestCloudService
}
