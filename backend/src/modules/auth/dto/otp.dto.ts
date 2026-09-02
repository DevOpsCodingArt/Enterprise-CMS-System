import { IsEmail, IsNotEmpty, IsIn, IsString, Length } from 'class-validator';

export class SendOtpDto {
  @IsEmail({}, { message: 'Valid email is required' })
  @IsNotEmpty()
  email: string;

  @IsIn(['registration', 'login', 'password_reset'], {
    message: 'Type must be registration, login, or password_reset',
  })
  type: 'registration' | 'login' | 'password_reset';
}

export class VerifyOtpDto {
  @IsEmail({}, { message: 'Valid email is required' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(6, 6, { message: 'OTP code must be exactly 6 digits' })
  otpCode: string;

  @IsIn(['registration', 'login', 'password_reset'], {
    message: 'Type must be registration, login, or password_reset',
  })
  type: 'registration' | 'login' | 'password_reset';
}
