

import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';
export class DeletePageRequest {

    @IsNotEmpty()
    public pageId: [];
}
