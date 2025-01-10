

import { EntityRepository, Repository } from 'typeorm';
import { PriceUpdateFileLog } from '../models/PriceUpdateFileLog';

@EntityRepository(PriceUpdateFileLog)
export class PriceUpdateFileLogRepository extends Repository<PriceUpdateFileLog>  {

}
