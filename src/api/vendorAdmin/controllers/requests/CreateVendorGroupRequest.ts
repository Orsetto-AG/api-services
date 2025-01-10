

import 'reflect-metadata';
import {IsNotEmpty, MaxLength} from 'class-validator';

export class CreateVendorGroup {

    @MaxLength(30, {
        message: 'name should be maximum 30 characters',
    })
    @IsNotEmpty({
        message: 'name is required',
    })
    public name: string;

    public description: string;

    @IsNotEmpty({
        message: 'status is required',
    })
    public status: number;

    @IsNotEmpty()
    public commission: number;

    @IsNotEmpty()
    public categoryIds: [];
}
