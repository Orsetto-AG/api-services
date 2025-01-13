import "reflect-metadata";
import {
  IsNotEmpty,
  MinLength,
  Matches,
} from "class-validator";
export class ResetPasswordRequest {
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
    message: "new password is required",
  })
  public newPassword: string;

  @IsNotEmpty({
    message: "Key is required",
  })
  public key: string;
}
