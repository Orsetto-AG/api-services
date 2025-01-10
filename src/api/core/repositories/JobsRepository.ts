

import { EntityRepository, Repository } from 'typeorm';
import { Jobs } from '../models/Jobs';

@EntityRepository(Jobs)
export class JobsRepository extends Repository<Jobs>  {

}
