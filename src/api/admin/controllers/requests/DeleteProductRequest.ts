

import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';
export class DeleteProductRequest {

    @IsNotEmpty()
    public productId: [];
}
