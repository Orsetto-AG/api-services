

import 'reflect-metadata';
import {IsNotEmpty, IsEmail} from 'class-validator';

export class CreateDeliveryPersonRequest {

    @IsNotEmpty()
    public firstName: string;

    public lastName: string;

    @IsNotEmpty()
    public mobileNumber: string;

    @IsEmail()
    public emailId: string;

    @IsNotEmpty()
    public password: string;

    public confirmPassword: string;

    public location: string;

    public allLocation: string;

    public image: string;

    @IsNotEmpty()
    public status: number;
}
