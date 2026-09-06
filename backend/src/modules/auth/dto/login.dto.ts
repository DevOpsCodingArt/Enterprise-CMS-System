import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsEmail,
  MinLength,
  MaxLength,
} from 'class-validator';

export class LoginDto {
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Identifier cannot exceed 255 characters' })
  identifier?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Email cannot exceed 255 characters' })
  email?: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @MaxLength(128, { message: 'Password cannot exceed 128 characters' })
  password: string;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}

export class CustomerLoginDto {
  @IsString()
  @IsNotEmpty({
    message: 'Phone, email, username, or customer code is required',
  })
  @MaxLength(255, { message: 'Identifier cannot exceed 255 characters' })
  identifier: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @MaxLength(128, { message: 'Password cannot exceed 128 characters' })
  password: string;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}

export class PlatformLoginDto {
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Identifier cannot exceed 255 characters' })
  identifier?: string;

  @IsEmail({}, { message: 'Valid email address is required' })
  @IsNotEmpty({ message: 'Email is required' })
  @MaxLength(255, { message: 'Email cannot exceed 255 characters' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @MaxLength(128, { message: 'Password cannot exceed 128 characters' })
  password: string;
}

