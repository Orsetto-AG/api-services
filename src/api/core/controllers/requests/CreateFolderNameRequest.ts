

import 'reflect-metadata';
import {IsNotEmpty} from 'class-validator';

export class FolderNameRequest {
    @IsNotEmpty()
    public folderName: string;

}
