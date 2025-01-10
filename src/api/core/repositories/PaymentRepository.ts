

import { EntityRepository, Repository } from 'typeorm';
import { Payment } from '../models/Payment';

@EntityRepository(Payment)
export class PaymentRepository extends Repository<Payment>  {

}
