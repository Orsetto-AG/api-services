

import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';
export class DeleteCategoryRequest {

    @IsNotEmpty()
    public categoryId: number;

}
