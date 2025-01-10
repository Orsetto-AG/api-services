

import { EntityRepository, Repository } from 'typeorm';
import { Industry } from '../models/Industry';

@EntityRepository(Industry)
export class IndustryRepository extends Repository<Industry>  {

}
