

import 'reflect-metadata';
import {IsNotEmpty, MaxLength} from 'class-validator';

export class CreateDeliveryLocationRequest {

    @IsNotEmpty()
    @MaxLength(6, {
        message: 'pincode should be max 6 digit',
    })
    public zipCode: number;

    public locationName: number;

}
