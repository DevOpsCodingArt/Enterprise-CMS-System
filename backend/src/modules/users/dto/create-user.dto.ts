import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsIn,
  IsUUID,
  IsArray,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UserOverrideInputDto {
  @IsUUID('4')
  permissionId: string;

  @IsBoolean()
  granted: boolean;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class CreateUserDto {
  @IsEmail({}, { message: 'Must be a valid corporate email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  fullName: string;

  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsString()
  @IsNotEmpty({ message: 'Department is required' })
  department: string;

  @IsString()
  @IsNotEmpty({ message: 'Designation is required' })
  designation: string;

  @IsOptional()
  @IsUUID('4', { message: 'branchId must be a valid UUID' })
  branchId?: string;

  @IsOptional()
  @IsIn(['company_owner', 'staff'], {
    message: 'userType must be either company_owner or staff',
  })
  userType?: 'company_owner' | 'staff';

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  groupIds?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserOverrideInputDto)
  overrides?: UserOverrideInputDto[];
}
