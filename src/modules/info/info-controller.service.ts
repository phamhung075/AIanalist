import { InfoService } from "./info.service";

export class InfoCloudService {

    constructor(
        private readonly infoService: InfoService
    ) { }

    async fetchDisplayableServerInfo(): Promise<string> {
        return this.infoService.fetchDisplayableServerInfo();
    }
}
