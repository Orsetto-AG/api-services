

import { EntityRepository, Repository } from 'typeorm';
import { VendorOrderProducts } from '../models/VendorOrderProducts';

@EntityRepository(VendorOrderProducts)
export class VendorOrderProductsRepository extends Repository<VendorOrderProducts>  {

}
