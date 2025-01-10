

import { EntityRepository, Repository } from 'typeorm';
import { OrderCancelReason } from '../models/OrderCancelReason';

@EntityRepository(OrderCancelReason)
export class OrderCancelReasonRepository extends Repository<OrderCancelReason>  {

}
