import { ExtendedUserContextRequest } from "../../interfaces/ExtendedFunctionRequest.interface";
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



	async test(_req: ExtendedUserContextRequest): Promise<any> {

			const result = await this.tradingEconomicsNewService.test();
			console.log(result);
			return result;
	}

}
