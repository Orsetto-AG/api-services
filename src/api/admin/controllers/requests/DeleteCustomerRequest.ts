

import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';
export class DeleteCustomerRequest {

    @IsNotEmpty()
    public customerId: [];
}
