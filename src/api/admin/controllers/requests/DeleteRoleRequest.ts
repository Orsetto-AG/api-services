

import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';
export class DeleteRoleRequest {

    @IsNotEmpty()
    public groupId: number;

}
