import { IsArray, IsUUID } from 'class-validator';

export class AssignUserGroupsDto {
  @IsArray()
  @IsUUID('4', { each: true, message: 'Each groupId must be a valid UUID' })
  groupIds: string[];
}
