

import { EntityRepository, Repository } from 'typeorm';
import { OrderStatus } from '../models/OrderStatus';

@EntityRepository(OrderStatus)
export class OrderStatusRepository extends Repository<OrderStatus>  {

}
