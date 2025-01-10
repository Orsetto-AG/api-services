

import { EntityRepository, Repository } from 'typeorm';
import { ProductVideo } from '../models/ProductVideo';

@EntityRepository(ProductVideo)
export class ProductVideoRepository extends Repository<ProductVideo>  {

}
