

import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';
export class DeleteCustomerGroupRequest {

    @IsNotEmpty()
    public groupId: number;

}
