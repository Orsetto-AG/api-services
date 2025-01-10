

import { EntityRepository, Repository } from 'typeorm';
import { ProductStockAlert } from '../models/ProductStockAlert';

@EntityRepository(ProductStockAlert)
export class ProductStockAlertRepository extends Repository<ProductStockAlert>  {

}
