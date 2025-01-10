

import { EntityRepository, Repository } from 'typeorm';
import { Settings } from '../models/Setting';

@EntityRepository(Settings)
export class SettingsRepository extends Repository<Settings>  {

}
