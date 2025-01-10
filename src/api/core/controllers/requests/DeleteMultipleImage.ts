

import 'reflect-metadata';
import {IsNotEmpty} from 'class-validator';
export class DeleteMultipleImage {
    @IsNotEmpty()
    public delete: any = [];
}
