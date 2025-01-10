

import { EntityRepository, Repository } from 'typeorm';
import { Banner } from '../models/Banner';

@EntityRepository(Banner)
export class BannerRepository extends Repository<Banner>  {

}
