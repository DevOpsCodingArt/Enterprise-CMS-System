import { IsUUID, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AssignTicketDto {
  @IsUUID('4', { message: 'assignedTo must be a valid UUID' })
  @IsNotEmpty({ message: 'Technician / Engineer ID is required' })
  assignedTo: string;

  @IsOptional()
  @IsString()
  assignedDepartment?: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
