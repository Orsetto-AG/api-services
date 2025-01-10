

import 'reflect-metadata';
import {IsNotEmpty, MaxLength} from 'class-validator';

export class CreateDeliveryLocationRequest {

    @IsNotEmpty()
    public zipCode: number;
    @MaxLength(255, {
        message: 'locationName should be maximum 255 character',
    })
    public locationName: string;
}
