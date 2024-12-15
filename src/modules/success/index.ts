import { SuccessTestCloudService } from './success-controller.service';
import { SuccessTestService } from './success.service';

const successTestService = new SuccessTestService();
const successTestCloudService = new SuccessTestCloudService(successTestService);

export {
	successTestService,
	successTestCloudService
}
