

import { EntityRepository, Repository } from 'typeorm';
import { StockLog } from '../models/StockLog';

@EntityRepository(StockLog)
export class StockLogRepository extends Repository<StockLog>  {

}
