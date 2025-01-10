/* tslint:disable:max-classes-per-file */



import 'reflect-metadata';
import { Type } from 'class-transformer';
import { IsNotEmpty, MaxLength, ValidateNested } from 'class-validator';

class PageGroupTranslationDTO {

    @MaxLength(255, {
        message: 'group name should be maximum 255 character',
    })
    @IsNotEmpty({
        message: 'group name is required',
    })
    public groupName: string;

    @IsNotEmpty({
        message: 'languageId is required',
    })
    public languageId: number;
}

export class CreatePageGroupTranslationDTO {

    @Type(() => PageGroupTranslationDTO)
    @ValidateNested()
    public pageGroupTranslation: PageGroupTranslationDTO[];

}
