

import { EntityRepository, Repository } from 'typeorm';
import { PaymentArchive } from '../models/PaymentArchive';

@EntityRepository(PaymentArchive)
export class PaymentArchiveRepository extends Repository<PaymentArchive>  {

}
