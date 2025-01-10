

import 'reflect-metadata';
import {IsNotEmpty, MaxLength} from 'class-validator';

export class CreateStockStatus {

    @MaxLength(255, {
        message: 'name should be maximum 255 characters',
    })
    @IsNotEmpty({
        message: 'name is required',
    })
    public name: string;

    @IsNotEmpty({
        message: 'status is required',
    })
    public status: number;
}
