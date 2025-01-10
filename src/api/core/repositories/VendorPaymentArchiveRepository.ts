

import { EntityRepository, Repository } from 'typeorm';
import { VendorPaymentArchive } from '../models/VendorPaymentArchive';

@EntityRepository(VendorPaymentArchive)
export class VendorPaymentArchiveRepository extends Repository<VendorPaymentArchive>  {

}
