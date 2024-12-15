import { InfoCloudService } from './info-controller.service';
import { InfoService } from './info.service';

const infoService = new InfoService();
const infoCloudService = new InfoCloudService(infoService);

export {
    infoService,
    infoCloudService
}
