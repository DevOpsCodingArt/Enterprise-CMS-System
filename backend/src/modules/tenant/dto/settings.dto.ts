import {
  IsString,
  IsNotEmpty,
  IsObject,
  IsArray,
  ValidateNested,
  IsInt,
  IsBoolean,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpsertSettingDto {
  @IsString()
  @IsNotEmpty({ message: 'Setting key is required' })
  key: string;

  @IsString()
  @IsNotEmpty({ message: 'Setting value is required' })
  value: string;
}

export class BulkUpdateSettingsDto {
  @IsObject()
  @IsNotEmpty()
  settings: Record<string, string>;
}

export class WorkingHourItemDto {
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number; // 0=Mon, 6=Sun

  @IsBoolean()
  isWorkingDay: boolean;

  @IsString()
  @IsNotEmpty()
  startTime: string; // HH:mm:ss

  @IsString()
  @IsNotEmpty()
  endTime: string; // HH:mm:ss

  @IsOptional()
  @IsString()
  offlineMessage?: string;
}

export class UpdateWorkingHoursDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkingHourItemDto)
  schedule: WorkingHourItemDto[];
}
