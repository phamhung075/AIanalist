import { FireBaseUtilsService } from "../../utils/firebase-utils.service";
import { TradingEconomicsNewCloudService } from "./trading-economics-new-cloud.service";
import { TradingEconomicsNewService } from "./trading-economics-new.service";

const fireBaseUtilsService = new FireBaseUtilsService();
const tradingEconomicsNewService = new TradingEconomicsNewService(fireBaseUtilsService);
const tradingEconomicsNewCloudService = new TradingEconomicsNewCloudService(tradingEconomicsNewService);

export { tradingEconomicsNewService, tradingEconomicsNewCloudService };

