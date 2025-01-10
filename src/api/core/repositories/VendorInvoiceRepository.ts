

import { EntityRepository, Repository } from 'typeorm';
import { VendorInvoice } from '../models/VendorInvoice';

@EntityRepository(VendorInvoice)
export class VendorInvoiceRepository extends Repository<VendorInvoice>  {

}
