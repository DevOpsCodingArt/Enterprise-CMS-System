import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  IsUUID,
  IsInt,
  IsArray,
  Min,
} from 'class-validator';

export class CreateTicketDto {
  @IsOptional()
  @IsIn(['subscriber', 'main_line', 'backbone', 'pon_network', 'node_outage'], {
    message: 'Invalid ticketScope',
  })
  ticketScope?:
    'subscriber' | 'main_line' | 'backbone' | 'pon_network' | 'node_outage';

  @IsOptional()
  @IsUUID('4', { message: 'customerId must be a valid UUID' })
  customerId?: string;

  @IsOptional()
  @IsUUID('4', { message: 'branchId must be a valid UUID' })
  branchId?: string;

  @IsOptional()
  @IsUUID('4', { message: 'conversationId must be a valid UUID' })
  conversationId?: string;

  @IsString()
  @IsNotEmpty({ message: 'Category is required' })
  @IsIn([
    'fiber_break',
    'main_line_break',
    'backbone_cut',
    'two_way_issue',
    'pon_shifting',
    'macro_bend',
    'rogue_onu_isolation',
    'splitter_fault',
    'joint_closure_damage',
    'onu_failure',
    'router_config',
    'wire_damage',
    'slow_speed',
    'new_installation',
    'relocation',
    'olt_card_failure',
    'core_switch_fault',
    'power_outage',
    'billing_inquiry',
    'recharge_verification',
    'other',
  ])
  category:
    | 'fiber_break'
    | 'main_line_break'
    | 'backbone_cut'
    | 'two_way_issue'
    | 'pon_shifting'
    | 'macro_bend'
    | 'rogue_onu_isolation'
    | 'splitter_fault'
    | 'joint_closure_damage'
    | 'onu_failure'
    | 'router_config'
    | 'wire_damage'
    | 'slow_speed'
    | 'new_installation'
    | 'relocation'
    | 'olt_card_failure'
    | 'core_switch_fault'
    | 'power_outage'
    | 'billing_inquiry'
    | 'recharge_verification'
    | 'other';

  @IsString()
  @IsNotEmpty({ message: 'Priority is required' })
  @IsIn(['low', 'normal', 'high', 'urgent'])
  priority: 'low' | 'normal' | 'high' | 'urgent';

  @IsString()
  @IsNotEmpty({ message: 'Ticket title is required' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Ticket description is required' })
  description: string;

  @IsOptional()
  @IsString()
  assignedDepartment?: string;

  @IsOptional()
  @IsUUID('4')
  assignedTo?: string;

  @IsOptional()
  @IsString()
  areaAffected?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  affectedSubscribersCount?: number;

  @IsOptional()
  @IsString()
  oltPonPort?: string;

  @IsOptional()
  @IsString()
  sourcePonPort?: string;

  @IsOptional()
  @IsString()
  destinationPonPort?: string;

  @IsOptional()
  @IsString()
  splitterId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  coreCountAffected?: number;

  @IsOptional()
  @IsString()
  cableType?: string;

  @IsOptional()
  @IsString()
  otdrBreakDistanceMeters?: string;

  @IsOptional()
  @IsString()
  opticalFaultType?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  ettrHours?: number;

  @IsOptional()
  @IsString()
  latitude?: string;

  @IsOptional()
  @IsString()
  longitude?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];
}
