/*
 * orsettocommerce API
 * version 0.0.1
 * Copyright (c) 2021 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */

import { EntityRepository, Repository } from 'typeorm';
import { SettlementItem } from '../models/SettlementItem';

@EntityRepository(SettlementItem)
export class SettlementItemRepository extends Repository<SettlementItem>  {

}
