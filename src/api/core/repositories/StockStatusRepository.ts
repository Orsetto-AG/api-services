

import { EntityRepository, Repository } from 'typeorm';
import { StockStatus } from '../models/stockStatus';

@EntityRepository(StockStatus)
export class StockStatusRepository extends Repository<StockStatus>  {

}
