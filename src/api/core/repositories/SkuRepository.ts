

import { EntityRepository, Repository } from 'typeorm';
import { Sku } from '../models/SkuModel';

@EntityRepository(Sku)
export class SkuRepository extends Repository<Sku>  {

}
