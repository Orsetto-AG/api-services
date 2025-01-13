import "reflect-metadata";
import {
  IsNotEmpty,
  MaxLength,
} from "class-validator";
export class OtpValidationRequest {
  @IsNotEmpty({
    message: "Email Id is required",
  })
  @MaxLength(96, {
    message: "emailId should be maximum 96 character",
  })
  public emailId: string;

  @IsNotEmpty({
    message: "Otp numbers required",
  })
  @IsNotEmpty()
  public otp: number;
}
