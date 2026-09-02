import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class AddTicketActivityDto {
  @IsOptional()
  @IsString()
  activityType?: string = 'internal_note';

  @IsString()
  @IsNotEmpty({ message: 'Comment / Note content is required' })
  comment: string;
}
