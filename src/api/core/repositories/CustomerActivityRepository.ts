

import { EntityRepository, Repository } from 'typeorm';
import { CustomerActivity } from '../models/CustomerActivity';

@EntityRepository(CustomerActivity)
export class CustomerActivityRepository extends Repository<CustomerActivity>  {

}
