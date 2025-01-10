

import { EntityRepository, Repository } from 'typeorm';
import { ProductImage } from '../models/ProductImage';

@EntityRepository(ProductImage)
export class ProductImageRepository extends Repository<ProductImage>  {

}
