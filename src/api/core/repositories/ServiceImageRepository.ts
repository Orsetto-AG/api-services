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
import { ServiceImage } from '../models/ServiceImage';

@EntityRepository(ServiceImage)
export class ServiceImageRepository extends Repository<ServiceImage>  {

}
