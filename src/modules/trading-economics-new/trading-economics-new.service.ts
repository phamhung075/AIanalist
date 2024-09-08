// import { AdresseStockage } from "@izumodev/lib-ofel-iso";
import { BaseRepositoryService } from "../_base/crud/baseRepository.service.abstract";
import { TradingEconomicsNew } from "../../models/TradingEconomicsNew.model";
import { FireBaseUtilsService } from "../../utils/firebase-utils.service";

export class TradingEconomicsNewService extends BaseRepositoryService<TradingEconomicsNew> {
	constructor(FireBaseUtilsService: FireBaseUtilsService) {
		super(FireBaseUtilsService, TradingEconomicsNew);
    }

    async test(): Promise<any[]> {
		const data = [] as  any[];
        try {

            return data ?? [];
        } catch (error) {
            console.error('Error while fetching AdresseStockage', error);
            throw error;
        }
    }

}
