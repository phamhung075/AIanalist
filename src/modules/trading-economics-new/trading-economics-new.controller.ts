import { Service } from 'typedi';
import { BaseController } from '../_base/crud/BaseController';
import TradingEconomicsNewService from './trading-economics-new.service';
import { ITradingEconomicsNew } from './trading-economics-new.interface';
import { CreateInput, UpdateInput } from './trading-economics-new.dto';

@Service()
class TradingEconomicsNewController extends BaseController<ITradingEconomicsNew, CreateInput, UpdateInput> {
  constructor(service: TradingEconomicsNewService) {
    super(service);
  }  
}

export default TradingEconomicsNewController;
