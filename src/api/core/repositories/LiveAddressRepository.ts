

import { EntityRepository, Repository } from 'typeorm';
import { LiveAddress } from '../models/LiveAddress';

@EntityRepository(LiveAddress)
export class LiveAddressRepository extends Repository<LiveAddress>  {

}
