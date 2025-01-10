

import { EntityRepository, Repository } from 'typeorm';
import { VendorGlobalSetting } from '../models/VendorGlobalSettings';

@EntityRepository(VendorGlobalSetting)
export class VendorGlobalSettingRepository extends Repository<VendorGlobalSetting>  {

}
