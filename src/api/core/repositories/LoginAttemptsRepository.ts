

import { EntityRepository, Repository } from 'typeorm';
import { LoginAttemptsModel } from '../models/LoginAttemptsModel';

@EntityRepository(LoginAttemptsModel)
export class LoginAttemptsRepository extends Repository<LoginAttemptsModel>  {

}
