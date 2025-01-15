import "reflect-metadata";
import {
  IsNotEmpty,
  MinLength,
  Matches,
  MaxLength,
  IsBoolean,
} from "class-validator";
export class RegisterRequest {
  @MinLength(8, {
    message: "password must contain minimum 8 character",
  })
  @Matches(
    /^(?=.*?[A-Z])(?=.*?[a-z])((?=.*?[0-9])|(?=.*?[#?!@$%^&*-])).{8,128}$/,
    {
      message:
        "Password must contain at least one number or one symbol and one uppercase and lowercase letter, and at least 8 or at most 128 characters",
    }
  )
  @IsNotEmpty({
    message: "password is required",
  })
  public password: string;

  @IsNotEmpty({
    message: "Email Id is required",
  })
  @MaxLength(96, {
    message: "emailId should be maximum 96 character",
  })
  public emailId: string;

  @IsNotEmpty({
    message: "Accepeted Term and Conditions required",
  })
  @IsBoolean()
  public isAcceptedTermAndConditions: boolean;
}
