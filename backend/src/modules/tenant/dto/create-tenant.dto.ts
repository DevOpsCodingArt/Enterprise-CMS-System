import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsInt,
  Min,
  Matches,
} from 'class-validator';

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty({ message: 'ISP Company legal name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Subdomain / slug is required' })
  @Matches(/^[a-z0-9-]+$/, {
    message:
      'Slug must only contain lowercase alphanumeric characters and hyphens',
  })
  slug: string;

  @IsEmail({}, { message: 'Valid owner admin email is required' })
  @IsNotEmpty()
  ownerEmail: string;

  @IsString()
  @IsNotEmpty({ message: 'Owner full name is required' })
  ownerName: string;

  @IsOptional()
  @IsString()
  ownerPassword?: string;

  @IsOptional()
  @IsString()
  subscriptionPlan?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxUsers?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxBranches?: number;

  @IsOptional()
  @IsString()
  primaryColor?: string;

  @IsOptional()
  @IsString()
  secondaryColor?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  faviconUrl?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsString()
  defaultLanguage?: string;
}
