

import { EntityRepository, Repository } from 'typeorm';
import { PaymentItems } from '../models/PaymentItems';

@EntityRepository(PaymentItems)
export class PaymentItemsRepository extends Repository<PaymentItems>  {

}
