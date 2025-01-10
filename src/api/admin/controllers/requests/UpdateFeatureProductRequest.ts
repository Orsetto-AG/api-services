

import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';
export class UpdateFeatureProduct {

    @IsNotEmpty({
        message: 'isFeature is required',
    })
    public isFeature: number;
}
