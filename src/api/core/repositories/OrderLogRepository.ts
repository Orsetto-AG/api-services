

import { EntityRepository, Repository } from 'typeorm';
import { OrderLog } from '../models/OrderLog';

@EntityRepository(OrderLog)
export class OrderLogRepository extends Repository<OrderLog>  {

}
