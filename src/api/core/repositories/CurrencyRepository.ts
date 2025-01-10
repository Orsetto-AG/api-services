

import { EntityRepository, Repository } from 'typeorm';
import { Currency } from '../models/Currency';

@EntityRepository(Currency)
export class CurrencyRepository extends Repository<Currency>  {

}
