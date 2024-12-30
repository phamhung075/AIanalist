// trading-economics-new.service.ts
import TradingEconomicsNewRepository from './trading-economics-new.repository';
import { ITradingEconomicsNew } from './trading-economics-new.interface';
import { Service } from 'typedi';
import { BaseService } from '../_base/crud/BaseService';

@Service()
class TradingEconomicsNewService extends BaseService<ITradingEconomicsNew> {
  constructor(repository: TradingEconomicsNewRepository) {
    super(repository);
  }

  // ✅ You can add TradingEconomicsNew-specific methods here
  // async getTradingEconomicsNewsByStatus(status: string): Promise<ITradingEconomicsNew[]> {
  //   const allTradingEconomicsNews = await this.getAll();
  //   return allTradingEconomicsNews.filter((trading-economics-new) => trading-economics-new.status === status);
}

export default TradingEconomicsNewService;