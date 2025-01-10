

import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';

export class UpdateVendorDocumentRequest {

    @IsNotEmpty()
    public certificate: Certificate;

}
interface Certificate {
    certificationType: string;
    refrenceNo: string;
    name: string;
    issuedBy: string;
    validFrom: string;
    validTo: string;
}
