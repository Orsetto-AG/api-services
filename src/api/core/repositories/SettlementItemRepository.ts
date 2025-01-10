

import { EntityRepository, Repository } from 'typeorm';
import { SettlementItem } from '../models/SettlementItem';

@EntityRepository(SettlementItem)
export class SettlementItemRepository extends Repository<SettlementItem>  {

}
