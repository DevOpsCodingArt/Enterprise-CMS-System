import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { TenantGuard } from '../../core/guards/tenant.guard';
import { PermissionGuard } from '../../core/guards/permission.guard';
import { RequirePermissions } from '../../core/decorators/require-permissions.decorator';
import { TenantId } from '../../core/decorators/tenant-id.decorator';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../core/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequirePermissions('user.view')
  async listUsers(@TenantId() companyId: string, @Query() query: UserQueryDto) {
    return this.usersService.listUsers(companyId, query);
  }

  @Post()
  @RequirePermissions('user.create')
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @TenantId() companyId: string,
    @Body() dto: CreateUserDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.usersService.createUser(companyId, dto, currentUser.id);
  }

  @Get(':id')
  @RequirePermissions('user.view')
  async getUserById(
    @TenantId() companyId: string,
    @Param('id') userId: string,
  ) {
    return this.usersService.getUserById(companyId, userId);
  }

  @Patch(':id')
  @RequirePermissions('user.edit')
  async updateUser(
    @TenantId() companyId: string,
    @Param('id') userId: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(companyId, userId, dto);
  }

  @Delete(':id')
  @RequirePermissions('user.delete')
  async deleteUser(@TenantId() companyId: string, @Param('id') userId: string) {
    return this.usersService.deleteUser(companyId, userId);
  }

  @Post(':id/reset-password')
  @RequirePermissions('user.edit')
  async resetPassword(
    @TenantId() companyId: string,
    @Param('id') userId: string,
    @Body('newPassword') newPassword?: string,
  ) {
    return this.usersService.resetPassword(companyId, userId, newPassword);
  }
}
