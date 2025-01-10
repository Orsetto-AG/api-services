

import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';
export class DeleteBannerRequest {

    @IsNotEmpty()
    public bannerId: [];
}
