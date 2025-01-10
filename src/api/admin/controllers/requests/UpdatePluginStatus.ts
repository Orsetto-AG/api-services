

import 'reflect-metadata';
import {IsNotEmpty} from 'class-validator';

export class UpdatePluginStatus {
    @IsNotEmpty()
    public pluginStatus: number;
}
