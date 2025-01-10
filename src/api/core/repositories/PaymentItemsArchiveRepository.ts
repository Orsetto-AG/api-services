

import { EntityRepository, Repository } from 'typeorm';
import { PaymentItemsArchive } from '../models/PaymentItemsArchive';

@EntityRepository(PaymentItemsArchive)
export class PaymentItemsArchiveRepository extends Repository<PaymentItemsArchive>  {

}
