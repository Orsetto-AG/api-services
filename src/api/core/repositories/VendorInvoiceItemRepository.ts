

import { EntityRepository, Repository } from 'typeorm';
import { VendorInvoiceItem } from '../models/VendorInvoiceItem';

@EntityRepository(VendorInvoiceItem)
export class VendorInvoiceItemRepository extends Repository<VendorInvoiceItem>  {

}
