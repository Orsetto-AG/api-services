

import { EntityRepository, Repository } from 'typeorm';

import { CustomerWishlist } from '../models/CustomerWishlist';

@EntityRepository(CustomerWishlist)
export class CustomerWishlistRepository extends Repository<CustomerWishlist>  {
}
