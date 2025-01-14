/*
 * orsettocommerce API
 * version 0.0.1
 * http://api.orsettocommerce.com
 *
 * Copyright (c) 2021 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */

import { EntityRepository, Repository } from 'typeorm';
import { ServiceEnquiry } from '../models/ServiceEnquiry';

@EntityRepository(ServiceEnquiry)
export class ServiceEnquiryRepository extends Repository<ServiceEnquiry>  {

}
