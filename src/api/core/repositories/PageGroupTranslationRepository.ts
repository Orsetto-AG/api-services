

import { EntityRepository, Repository } from 'typeorm';
import { PageGroupTranslation } from '../models/PageGroupTranslation';

@EntityRepository(PageGroupTranslation)
export class PageGroupTranslationRepository extends Repository<PageGroupTranslation>  {

}
