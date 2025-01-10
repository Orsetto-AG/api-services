

import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';
export class DeleteEnquiry {

    @IsNotEmpty()
    public enquiryId: [];
}
