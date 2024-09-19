import {
  IsBoolean,
  IsEmail,
  IsJWT,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';
import {
  NAME_REGEX,
  SLUG_REGEX,
  BCRYPT_HASH,
  PASSWORD_REGEX,
} from 'src/constants/regex.const';

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}

export abstract class PasswordsDto {
  @IsString()
  @Length(8, 35)
  @Matches(PASSWORD_REGEX, {
    message:
      'Password requires a lowercase letter, an uppercase letter, and a number or symbol',
  })
  public password!: string;
}

export abstract class SignUpDto extends PasswordsDto {
  @IsString()
  @Length(3, 50, {
    message: 'Name has to be between 3 and 50 characters.',
  })
  @Matches(NAME_REGEX, {
    message: 'Name can only contain letters, dtos, numbers and spaces.',
  })
  public name!: string;

  @IsString()
  @IsEmail()
  @Length(5, 255)
  public email!: string;
}

export abstract class EmailDto {
  @IsString()
  @IsEmail()
  @Length(5, 255)
  public email: string;
}

export abstract class ResetPasswordDto extends PasswordsDto {
  @IsString()
  @IsJWT()
  public resetToken!: string;
}

export abstract class ChangePasswordDto extends PasswordsDto {
  @IsString()
  @MinLength(1)
  public password!: string;
}
export class SigninDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UserDto {
  @IsString()
  @Length(3, 100)
  @Matches(NAME_REGEX, {
    message: 'Name must not have special characters',
  })
  public name: string;

  @IsString()
  @Length(3, 106)
  @Matches(SLUG_REGEX, {
    message: 'Username must be a valid slug',
  })
  public username: string;

  @IsString()
  @IsEmail()
  @Length(5, 255)
  public email: string;
}

export class LogoutDto {
  @IsString()
  @IsJWT()
  public token: string;
}
