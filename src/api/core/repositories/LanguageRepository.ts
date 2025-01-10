

import { EntityRepository, Repository } from 'typeorm';

import { Language } from '../models/Language';

@EntityRepository(Language)
export class LanguageRepository extends Repository<Language>  {

}
