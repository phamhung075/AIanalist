import { Container } from 'typedi';
import TradingEconomicsNewController from './trading-economics-new.controller';
import TradingEconomicsNewService from './trading-economics-new.service';
import TradingEconomicsNewRepository from './trading-economics-new.repository';


class TradingEconomicsNewModule {
    public tradingEconomicsNewController: TradingEconomicsNewController;
    public tradingEconomicsNewService: TradingEconomicsNewService;
    public tradingEconomicsNewRepository: TradingEconomicsNewRepository;

    constructor() {
        this.tradingEconomicsNewController = Container.get(TradingEconomicsNewController);
        this.tradingEconomicsNewService = Container.get(TradingEconomicsNewService);
        this.tradingEconomicsNewRepository = Container.get(TradingEconomicsNewRepository);
    }
}

const tradingEconomicsNewModule = new TradingEconomicsNewModule();

export const { tradingEconomicsNewController, tradingEconomicsNewService, tradingEconomicsNewRepository } = tradingEconomicsNewModule;