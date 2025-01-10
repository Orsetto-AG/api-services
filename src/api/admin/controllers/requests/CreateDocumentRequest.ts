

import 'reflect-metadata';
import {IsNotEmpty} from 'class-validator';

export class CreateDocumentRequest {

    public id: number;

    @IsNotEmpty({
        message: 'name is required',
    })
    public name: string;

    public isMandatory: number;

    public maxUploadSize: number;

    @IsNotEmpty()
    public isActive: number;
}
