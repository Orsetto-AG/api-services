

import { EntityRepository, Repository } from 'typeorm';
import { Tax } from '../models/Tax';

@EntityRepository(Tax)
export class TaxRepository extends Repository<Tax>  {

}
