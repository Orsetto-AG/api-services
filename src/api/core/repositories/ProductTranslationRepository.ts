

import { EntityRepository, Repository } from 'typeorm';
import { ProductTranslation } from '../models/ProductTranslation';

@EntityRepository(ProductTranslation)
export class ProductTranslationRepository extends Repository<ProductTranslation>  {
    // --
}
