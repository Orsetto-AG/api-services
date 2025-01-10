

export interface Section {
    sectionId?: number;
    sectionName?: string;
    sectionItem?: [];
    sectionType?: number;
}

import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';

export class CreateSiteFilterRequest {
    @IsNotEmpty()
    public filterName: string;

    @IsNotEmpty()
    public categoryId: [];

    public section: Section[];

}
