

import { EntityRepository, Repository } from 'typeorm';
import { ProductToCategory } from '../models/ProductToCategory';

@EntityRepository(ProductToCategory)
export class ProductToCategoryRepository extends Repository<ProductToCategory>  {

}
