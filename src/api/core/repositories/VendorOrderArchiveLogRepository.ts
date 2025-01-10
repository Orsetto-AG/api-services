

import { EntityRepository, Repository } from 'typeorm';
import { VendorOrderArchiveLog } from '../models/VendorOrderArchiveLog';

@EntityRepository(VendorOrderArchiveLog)
export class VendorOrderArchiveLogRepository extends Repository<VendorOrderArchiveLog>  {

}
