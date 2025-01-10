

import { EntityRepository, Repository } from 'typeorm';
import { PageTranslation } from '../models/PageTranslation';

@EntityRepository(PageTranslation)
export class PageTranslationRepository extends Repository<PageTranslation>  {

}
