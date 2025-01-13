

import { EntityRepository, Repository } from 'typeorm';
import { RegistrationOtp } from '../models/RegistrationOtpModel';

@EntityRepository(RegistrationOtp)
export class RegistrationOtpRepository extends Repository<RegistrationOtp> {

}
