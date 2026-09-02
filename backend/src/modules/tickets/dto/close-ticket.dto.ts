import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';

export class CloseTicketDto {
  @IsOptional()
  @IsString()
  closingNotes?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  feedbackRating?: number;
}
