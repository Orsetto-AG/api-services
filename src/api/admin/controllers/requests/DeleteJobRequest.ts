

import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';
export class DeleteJob {

    @IsNotEmpty()
    public jobId: [];
}
