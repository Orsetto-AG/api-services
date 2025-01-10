

import { EntityRepository, Repository } from 'typeorm';
import { SiteFilter } from '../models/SiteFilter';

@EntityRepository(SiteFilter)
export class SiteFilterRepository extends Repository<SiteFilter>  {

}
