import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsIn,
  IsUUID,
  IsDateString,
} from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty({ message: 'Customer full name is required' })
  fullName: string;

  @IsString()
  @IsNotEmpty({ message: 'Primary contact phone number is required' })
  phone: string;

  @IsOptional()
  @IsString()
  altPhone?: string;

  @IsOptional()
  @IsString()
  cnic?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Must be a valid email address' })
  email?: string;

  @IsOptional()
  @IsString()
  username?: string; // PPPoE / RADIUS account name

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  area?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  latitude?: string;

  @IsOptional()
  @IsString()
  longitude?: string;

  @IsOptional()
  @IsUUID('4', { message: 'branchId must be a valid UUID' })
  branchId?: string;

  @IsOptional()
  @IsIn(['residential', 'business', 'corporate', 'government', 'vip'], {
    message: 'Invalid customer class',
  })
  customerClass?:
    'residential' | 'business' | 'corporate' | 'government' | 'vip';

  @IsOptional()
  @IsString()
  packageId?: string;

  @IsOptional()
  @IsString()
  packageName?: string;

  @IsOptional()
  @IsString()
  packageSpeed?: string;

  @IsOptional()
  @IsString()
  monthlyBilling?: string;

  @IsOptional()
  @IsDateString()
  billingExpiryDate?: string;

  @IsOptional()
  @IsString()
  onuSignalDbm?: string;

  @IsOptional()
  @IsString()
  oltPonPort?: string;

  @IsOptional()
  @IsString()
  macAddress?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
