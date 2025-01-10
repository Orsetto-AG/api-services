

import { EntityRepository, Repository } from 'typeorm';
import { CustomerCart } from '../models/CustomerCart';

@EntityRepository(CustomerCart)
export class CustomerCartRepository extends Repository<CustomerCart>  {

}
