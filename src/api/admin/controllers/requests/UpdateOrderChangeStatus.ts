

import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';

export class UpdateOrderChangeStatus {

    @IsNotEmpty()
    public orderId: number;

    @IsNotEmpty()
    public orderStatusId: number;
}
