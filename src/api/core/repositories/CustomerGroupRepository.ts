

import { EntityRepository, Repository } from 'typeorm';
import { CustomerGroup } from '../models/CustomerGroup';

@EntityRepository(CustomerGroup)
export class CustomerGroupRepository extends Repository<CustomerGroup>  {

}
