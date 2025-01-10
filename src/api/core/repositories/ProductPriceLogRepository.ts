

import { EntityRepository, Repository } from 'typeorm';
import { ProductPriceLog } from '../models/ProductPriceLog';

@EntityRepository(ProductPriceLog)
export class ProductPriceLogRepository extends Repository<ProductPriceLog>  {

}
