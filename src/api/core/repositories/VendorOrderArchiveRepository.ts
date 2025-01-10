

import { EntityRepository, Repository } from 'typeorm';
import { VendorOrderArchive } from '../models/VendorOrderArchive';

@EntityRepository(VendorOrderArchive)
export class VendorOrderArchiveRepository extends Repository<VendorOrderArchive>  {

}
