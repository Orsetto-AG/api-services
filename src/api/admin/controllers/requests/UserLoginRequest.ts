

import 'reflect-metadata';
import {IsNotEmpty, IsEmail} from 'class-validator';

export class UserLogin {

    @IsEmail()
    @IsNotEmpty()
    public username: string;

    @IsNotEmpty({
        message: 'Password is required',
    })
    public password: string;

}
