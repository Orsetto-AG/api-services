

import 'reflect-metadata';
import {IsNotEmpty} from 'class-validator';

export class CreateVendorCategoryRequest {
    @IsNotEmpty()
    public vendorId: number;

    @IsNotEmpty()
    public categoryId: string;

    public commission: number;
}
