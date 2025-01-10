

import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';
export class DeleteOrderRequest {

    @IsNotEmpty()
    public orderId: [];
}
