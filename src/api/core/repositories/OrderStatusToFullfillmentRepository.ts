

import { EntityRepository, Repository } from 'typeorm';
import { OrderStatusToFullfillment } from '../models/OrderStatusToFullfillment';

@EntityRepository(OrderStatusToFullfillment)
export class OrderStatusToFullfillmentRepository extends Repository<OrderStatusToFullfillment> {
    // --
}
