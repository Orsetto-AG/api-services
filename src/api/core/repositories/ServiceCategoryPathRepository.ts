/*
 * orsettocommerce API
 * version 5.0.0
 * http://api.orsettocommerce.com
 *
 * Copyright (c) 2021 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */

import { EntityRepository, Repository } from 'typeorm';

import { ServiceCategoryPath } from '../models/ServiceCategoryPath';

@EntityRepository(ServiceCategoryPath)
export class ServiceCategoryPathRepository extends Repository<ServiceCategoryPath>  {

}
