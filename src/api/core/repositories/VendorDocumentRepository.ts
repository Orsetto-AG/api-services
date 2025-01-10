

import { EntityRepository, Repository } from 'typeorm';
import { VendorDocument } from '../models/VendorDocument';

@EntityRepository(VendorDocument)
export class VendorDocumentRepository extends Repository<VendorDocument>  {

}
