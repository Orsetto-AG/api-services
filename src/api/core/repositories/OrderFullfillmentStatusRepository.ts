

import { EntityRepository, Repository } from 'typeorm';
import { OrderFullfillmentStatus } from '../models/OrderFullfillmentStatus';

@EntityRepository(OrderFullfillmentStatus)
export class OrderFulfillmentStatusRepository extends Repository<OrderFullfillmentStatus> {
    // --
}
