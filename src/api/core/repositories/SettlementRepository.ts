

import { EntityRepository, Repository } from 'typeorm';
import {Settlement} from '../models/Settlement';

@EntityRepository(Settlement)
export class SettlementRepository extends Repository<Settlement>  {

}
