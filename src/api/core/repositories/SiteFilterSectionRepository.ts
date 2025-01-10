

import { EntityRepository, Repository } from 'typeorm';
import { SiteFilterSection } from '../models/SiteFilterSection';

@EntityRepository(SiteFilterSection)
export class SiteFilterSectionRepository extends Repository<SiteFilterSection>  {

}
