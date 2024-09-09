import { ErrorTestCloudService } from './error-cloud.service';
import { ErrorTestService } from './error.service';

const errorTestService = new ErrorTestService();
const errorTestCloudService = new ErrorTestCloudService(errorTestService);

export {
	errorTestService,
	errorTestCloudService
}
