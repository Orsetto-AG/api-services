/*
 * orsettocommerce API
 * version 5.0.0
 * Copyright (c) 2021 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */

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