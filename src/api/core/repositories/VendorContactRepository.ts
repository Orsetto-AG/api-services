

import { EntityRepository, Repository } from 'typeorm';
import { VendorContact } from '../models/VendorContact';

@EntityRepository(VendorContact)
export class VendorContactRepository extends Repository<VendorContact>  {
}
