

import { EntityRepository, Repository } from 'typeorm';
import { ExportLog } from '../models/ExportLog';
@EntityRepository(ExportLog)
export class ExportLogRepository extends Repository<ExportLog>  {

}
