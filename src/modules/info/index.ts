import { InfoCloudService } from './info-cloud.service';
import { InfoService } from './info.service';

const infoService = new InfoService();
const infoCloudService = new InfoCloudService(infoService);

export {
    infoService,
    infoCloudService
}
