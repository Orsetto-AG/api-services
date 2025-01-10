

import { EntityRepository, Repository } from 'typeorm';
import { Zone } from '../models/Zone';

@EntityRepository(Zone)
export class ZoneRepository extends Repository<Zone>  {

}
