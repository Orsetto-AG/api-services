

import { EntityRepository, Repository } from 'typeorm';
import { PageGroup } from '../models/PageGroup';

@EntityRepository(PageGroup)
export class PageGroupRepository extends Repository<PageGroup>  {

}
