

import { EntityRepository, Repository } from 'typeorm';
import { CategoryTranslation } from '../models/CategoryTranslation';

@EntityRepository(CategoryTranslation)
export class CategoryTranslationRepository extends Repository<CategoryTranslation>  {
    // --
}
