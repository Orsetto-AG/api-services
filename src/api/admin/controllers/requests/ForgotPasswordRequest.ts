

import 'reflect-metadata';
import { MinLength, MaxLength} from 'class-validator';
export class ForgotPassword {
    @MaxLength(96, {
        message: 'email is maximum 96 character',
    })
    @MinLength(4, {
        message: 'email is minimum 4 character',
    })
    public email: string;
}
