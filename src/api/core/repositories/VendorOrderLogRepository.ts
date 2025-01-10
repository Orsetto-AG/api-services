

import { EntityRepository, Repository } from 'typeorm';
import { VendorOrderLog } from '../models/VendorOrderLog';

@EntityRepository(VendorOrderLog)
export class VendorOrderLogRepository extends Repository<VendorOrderLog>  {

}
