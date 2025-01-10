

import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';
export class FileNameRequest {
    @IsNotEmpty()
    public image: string;

    public path: string;

    public fileName: string;

    public fileType: number;

    public documentId: number;
}
