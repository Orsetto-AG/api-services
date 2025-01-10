

import { EntityRepository, Repository } from 'typeorm';
import { PermissionModule } from '../models/PermissionModule';

@EntityRepository(PermissionModule)
export class PermissionModuleRepository extends Repository<PermissionModule>  {

}
