

import { EntityRepository, Repository } from 'typeorm';
import { ProductViewLog } from '../models/productViewLog';

@EntityRepository(ProductViewLog)
export class ProductViewLogRepository extends Repository<ProductViewLog>  {

}
