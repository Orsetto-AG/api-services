

import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';

export class  DeliveryPersonLogin {
    @IsNotEmpty()
    public emailId: string;

    @IsNotEmpty()
    public password: string;
}
