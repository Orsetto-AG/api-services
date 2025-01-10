

import { EntityRepository, Repository } from 'typeorm';
import { Contact } from '../models/Contact';

@EntityRepository(Contact)
export class ContactRepository extends Repository<Contact>  {

}
