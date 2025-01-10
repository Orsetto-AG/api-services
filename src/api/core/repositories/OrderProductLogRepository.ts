

import { EntityRepository, Repository } from 'typeorm';
import { OrderProductLog } from '../models/OrderProductLog';

@EntityRepository(OrderProductLog)
export class OrderProductLogRepository extends Repository<OrderProductLog>  {

}
