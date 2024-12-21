import { ExtendedUserContextRequest } from "@src/_core/guard/handle-permission/user-context.interface";
import { TradingEconomicsNew } from "../../models/TradingEconomicsNew.model";
import { BaseRepositoryController } from "../_base/crud/baseRepository.controller.abstract";
import { TradingEconomicsNewService } from "./trading-economics-new.service";

export class TradingEconomicsNewCloudService extends BaseRepositoryController<TradingEconomicsNew> {
    constructor(
		private readonly tradingEconomicsNewService: TradingEconomicsNewService,
    ) {
		super(TradingEconomicsNew);
    }

	baseRepositoryService(): TradingEconomicsNewService {
		return this.tradingEconomicsNewService; // Assuming this is instantiated elsewhere
    }



	async test(_req: ExtendedUserContextRequest): Promise<any[]> {

        try {
			const result = await this.tradingEconomicsNewService.test();
            return result;
        } catch (error) {
            console.error(`Error getting ${this.getClassName()}`, error);
            throw error;
        }
    }

}
