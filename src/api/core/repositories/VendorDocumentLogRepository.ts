

import { EntityRepository, Repository } from 'typeorm';
import { VendorDocumentLog } from '../models/VendorDocumentLog';
@EntityRepository(VendorDocumentLog)
export class VendorDocumentLogRepository extends Repository<VendorDocumentLog> {
    // --
}
