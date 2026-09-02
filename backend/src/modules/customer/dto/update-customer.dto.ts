import {
  IsString,
  IsOptional,
  IsEmail,
  IsIn,
  IsUUID,
  IsDateString,
} from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

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
  username?: string;

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
  @IsUUID('4')
  branchId?: string;

  @IsOptional()
  @IsIn(['residential', 'business', 'corporate', 'government', 'vip'])
  customerClass?:
    'residential' | 'business' | 'corporate' | 'government' | 'vip';

  @IsOptional()
  @IsIn(['active', 'inactive', 'suspended', 'disconnected'])
  status?: 'active' | 'inactive' | 'suspended' | 'disconnected';

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
  @IsIn(['online', 'offline', 'disabled'])
  pppoeStatus?: 'online' | 'offline' | 'disabled';

  @IsOptional()
  @IsString()
  currentIp?: string;

  @IsOptional()
  @IsString()
  macAddress?: string;

  @IsOptional()
  @IsString()
  onuSignalDbm?: string;

  @IsOptional()
  @IsString()
  oltPonPort?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  languagePreference?: string;
}
