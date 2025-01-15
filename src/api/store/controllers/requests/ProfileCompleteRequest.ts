import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class PersonalInfo {
  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsDateString()
  @IsNotEmpty()
  birthday: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  streetNumber: string;

  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsOptional()
  otherAddressInfo?: string;
}

class CompanyInfo {
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsBoolean()
  @IsOptional()
  isVatChargeable?: boolean;

  @IsString()
  @IsOptional()
  vatNumber?: string;

  @IsBoolean()
  @IsOptional()
  isTradeRegistered?: boolean;

  @IsString()
  @IsOptional()
  tradeRegisteredNumber?: string;

  @IsBoolean()
  @IsOptional()
  isRegisterOwner?: boolean;

  @IsString()
  @IsOptional()
  registerPersonName?: string;

  @IsString()
  @IsOptional()
  registerPersonSurname?: string;

  @IsString()
  @IsOptional()
  registerPersonSex?: string;
}

export class ProfileCompleteRequest {
  @ValidateNested()
  @Type(() => PersonalInfo)
  personal: PersonalInfo;

  @ValidateNested()
  @Type(() => CompanyInfo)
  @IsOptional()
  company?: CompanyInfo;
}
