

import { EntityRepository, Repository } from 'typeorm';
import { SiteFilterSectionItem } from '../models/SiteFilterSectionItem';

@EntityRepository(SiteFilterSectionItem)
export class SiteFilterSectionItemRepository extends Repository<SiteFilterSectionItem>  {

}
