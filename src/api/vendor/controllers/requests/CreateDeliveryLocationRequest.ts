/*
 * orsettocommerce API
 * version 0.0.1
 * Copyright (c) 2021 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */

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
