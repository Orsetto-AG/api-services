

import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';

export class CreateTirePriceRequest {
    public hasTirePrice: number;

    @IsNotEmpty()
    public quantity: number;

    @IsNotEmpty()
    public price: string;

    @IsNotEmpty()
    public productId: number;
}
