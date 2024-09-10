import { SuccessTestCloudService } from './success-cloud.service';
import { SuccessTestService } from './success.service';

const errorTestService = new SuccessTestService();
const errorTestCloudService = new SuccessTestCloudService(errorTestService);

export {
	errorTestService,
	errorTestCloudService
}
