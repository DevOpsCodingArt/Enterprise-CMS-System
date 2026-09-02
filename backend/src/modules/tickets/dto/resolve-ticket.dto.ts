import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class ResolveTicketDto {
  @IsString()
  @IsNotEmpty({ message: 'Resolution outcome is required' })
  resolutionOutcome: string;

  @IsString()
  @IsNotEmpty({ message: 'Resolution notes are required' })
  resolutionNotes: string;

  @IsOptional()
  @IsString()
  materialUsed?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];
}
