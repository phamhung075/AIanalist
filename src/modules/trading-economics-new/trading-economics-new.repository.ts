// trading-economics-new.repository.ts
import { Service } from 'typedi';
import { BaseRepository } from '../_base/crud/BaseRepository';
import { ITradingEconomicsNew } from './trading-economics-new.interface';

@Service()
export class TradingEconomicsNewRepository extends BaseRepository<ITradingEconomicsNew> {
  constructor() {
    super('trading-economics-news');
  }
}
export default TradingEconomicsNewRepository;
