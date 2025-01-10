

import { EntityRepository, Repository } from 'typeorm';
import { CustomerToGroup } from '../models/CustomerToGroup';

@EntityRepository(CustomerToGroup)
export class CustomerToGroupRepository extends Repository<CustomerToGroup> {
    // --
}
