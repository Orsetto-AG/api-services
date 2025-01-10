

import 'reflect-metadata';
import { MinLength, MaxLength , IsEmail} from 'class-validator';
export class VendorForgotPasswordRequest {
    @MaxLength(60, {
        message: 'Name is maximum 30 character',
    })
    @MinLength(4, {
        message: 'Name is minimum 4 character',
    })
    @IsEmail()
    public email: string;
}
