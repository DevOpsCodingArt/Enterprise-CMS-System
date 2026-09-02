import {
  IsArray,
  ValidateNested,
  IsUUID,
  IsBoolean,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UserOverrideItemDto {
  @IsUUID('4', { message: 'permissionId must be a valid UUID' })
  permissionId: string;

  @IsBoolean({
    message: 'granted must be a boolean (true to grant, false to deny)',
  })
  granted: boolean;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class SetUserOverridesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserOverrideItemDto)
  overrides: UserOverrideItemDto[];
}
