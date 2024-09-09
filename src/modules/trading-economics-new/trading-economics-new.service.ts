// import { AdresseStockage } from "@izumodev/lib-ofel-iso";
import { BaseRepositoryService } from "../_base/crud/baseRepository.service.abstract";
import { TradingEconomicsNew } from "../../models/TradingEconomicsNew.model";
import { FireBaseUtilsService } from "../../utils/firebase-utils.service";
import { _ERROR } from "../../_core/helper/async-handler/error/error.response";

export class TradingEconomicsNewService extends BaseRepositoryService<TradingEconomicsNew> {
	constructor(FireBaseUtilsService: FireBaseUtilsService) {
		super(FireBaseUtilsService, TradingEconomicsNew);
    }

    async test(): Promise<any[]> {
		throw new _ERROR.RequestTooLongError() 
    }

}
