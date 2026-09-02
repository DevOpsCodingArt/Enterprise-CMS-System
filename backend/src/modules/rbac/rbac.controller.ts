import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Put,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RbacService } from './rbac.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AssignUserGroupsDto } from './dto/assign-user-groups.dto';
import { SetUserOverridesDto } from './dto/set-user-overrides.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { TenantGuard } from '../../core/guards/tenant.guard';
import { PermissionGuard } from '../../core/guards/permission.guard';
import { RequirePermissions } from '../../core/decorators/require-permissions.decorator';
import { TenantId } from '../../core/decorators/tenant-id.decorator';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../core/decorators/current-user.decorator';

@Controller('rbac')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionGuard)
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  @Get('categories')
  @RequirePermissions('user.manage_permissions')
  async getCategories() {
    return this.rbacService.getCategories();
  }

  @Get('permissions')
  @RequirePermissions('user.manage_permissions')
  async getPermissions() {
    return this.rbacService.getPermissions();
  }

  @Get('groups')
  @RequirePermissions('user.manage_permissions')
  async getGroups(@TenantId() companyId: string) {
    return this.rbacService.getGroups(companyId);
  }

  @Post('groups')
  @RequirePermissions('user.manage_permissions')
  @HttpCode(HttpStatus.CREATED)
  async createGroup(
    @TenantId() companyId: string,
    @Body() dto: CreateGroupDto,
  ) {
    return this.rbacService.createGroup(companyId, dto);
  }

  @Get('groups/:id')
  @RequirePermissions('user.manage_permissions')
  async getGroupById(
    @TenantId() companyId: string,
    @Param('id') groupId: string,
  ) {
    return this.rbacService.getGroupById(companyId, groupId);
  }

  @Patch('groups/:id')
  @RequirePermissions('user.manage_permissions')
  async updateGroup(
    @TenantId() companyId: string,
    @Param('id') groupId: string,
    @Body() dto: UpdateGroupDto,
  ) {
    return this.rbacService.updateGroup(companyId, groupId, dto);
  }

  @Delete('groups/:id')
  @RequirePermissions('user.manage_permissions')
  async deleteGroup(
    @TenantId() companyId: string,
    @Param('id') groupId: string,
  ) {
    return this.rbacService.deleteGroup(companyId, groupId);
  }

  @Get('users/:userId/matrix')
  @RequirePermissions('user.manage_permissions')
  async getUserPermissionMatrix(
    @TenantId() companyId: string,
    @Param('userId') userId: string,
  ) {
    return this.rbacService.getUserPermissionMatrix(companyId, userId);
  }

  @Put('users/:userId/groups')
  @RequirePermissions('user.manage_permissions')
  async assignUserGroups(
    @TenantId() companyId: string,
    @Param('userId') userId: string,
    @Body() dto: AssignUserGroupsDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.rbacService.assignUserGroups(
      companyId,
      userId,
      dto.groupIds,
      currentUser.id,
    );
  }

  @Put('users/:userId/overrides')
  @RequirePermissions('user.manage_permissions')
  async setUserOverrides(
    @TenantId() companyId: string,
    @Param('userId') userId: string,
    @Body() dto: SetUserOverridesDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.rbacService.setUserOverrides(
      companyId,
      userId,
      dto,
      currentUser.id,
    );
  }
}
