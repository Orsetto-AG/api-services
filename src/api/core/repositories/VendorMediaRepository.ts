

import { EntityRepository, Repository } from 'typeorm';
import { VendorMedia } from '../models/VendorMedia';
@EntityRepository(VendorMedia)
export class VendorMediaRepository extends Repository<VendorMedia> {
    // --
}
