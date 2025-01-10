

import { EntityRepository, Repository } from 'typeorm';
import { EmailTemplate } from '../models/EmailTemplate';

@EntityRepository(EmailTemplate)
export class EmailTemplateRepository extends Repository<EmailTemplate>  {

}
