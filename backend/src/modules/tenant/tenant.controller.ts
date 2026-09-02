import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { UpdateCompanyProfileDto } from './dto/company-profile.dto';
import { CreateBranchDto, UpdateBranchDto } from './dto/branch.dto';
import {
  UpsertSettingDto,
  BulkUpdateSettingsDto,
  UpdateWorkingHoursDto,
} from './dto/settings.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { TenantGuard } from '../../core/guards/tenant.guard';
import { PermissionGuard } from '../../core/guards/permission.guard';
import { RequirePermissions } from '../../core/decorators/require-permissions.decorator';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../core/decorators/current-user.decorator';
import { TenantId } from '../../core/decorators/tenant-id.decorator';

@Controller()
@UseGuards(JwtAuthGuard, PermissionGuard)
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  // ==========================================
  // PLATFORM OWNER ENDPOINTS (/api/v1/tenants)
  // ==========================================

  @Post('tenants')
  @RequirePermissions('*.*')
  @HttpCode(HttpStatus.CREATED)
  async provisionTenant(
    @Body() dto: CreateTenantDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.tenantService.provisionTenant(dto, user.id);
  }

  @Get('tenants')
  @RequirePermissions('*.*')
  async listTenants(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('isActive') isActive?: boolean,
  ) {
    return this.tenantService.listTenants({
      page,
      limit,
      search,
      isActive:
        isActive !== undefined ? String(isActive) === 'true' : undefined,
    });
  }

  @Get('tenants/:id')
  @RequirePermissions('*.*')
  async getTenantById(@Param('id') id: string) {
    return this.tenantService.getTenantById(id);
  }

  @Patch('tenants/:id')
  @RequirePermissions('*.*')
  async updateTenant(@Param('id') id: string, @Body() dto: UpdateTenantDto) {
    return this.tenantService.updateTenant(id, dto);
  }

  @Delete('tenants/:id')
  @RequirePermissions('*.*')
  async deleteTenant(@Param('id') id: string) {
    return this.tenantService.deleteTenant(id);
  }

  // ==========================================
  // COMPANY OPERATIONS ENDPOINTS (/api/v1/tenant)
  // ==========================================

  @Get('tenant/profile')
  @UseGuards(TenantGuard)
  async getCompanyProfile(@TenantId() companyId: string) {
    return this.tenantService.getCompanyProfile(companyId);
  }

  @Patch('tenant/profile')
  @UseGuards(TenantGuard)
  @RequirePermissions('settings.edit')
  async updateCompanyProfile(
    @TenantId() companyId: string,
    @Body() dto: UpdateCompanyProfileDto,
  ) {
    return this.tenantService.updateCompanyProfile(companyId, dto);
  }

  @Get('tenant/settings')
  @UseGuards(TenantGuard)
  @RequirePermissions('settings.view')
  async getCompanySettings(@TenantId() companyId: string) {
    return this.tenantService.getCompanySettings(companyId);
  }

  @Put('tenant/settings')
  @UseGuards(TenantGuard)
  @RequirePermissions('settings.edit')
  async bulkUpdateSettings(
    @TenantId() companyId: string,
    @Body() dto: BulkUpdateSettingsDto,
  ) {
    return this.tenantService.bulkUpdateSettings(companyId, dto.settings);
  }

  @Put('tenant/settings/:key')
  @UseGuards(TenantGuard)
  @RequirePermissions('settings.edit')
  async upsertSetting(
    @TenantId() companyId: string,
    @Param('key') key: string,
    @Body() dto: UpsertSettingDto,
  ) {
    return this.tenantService.upsertSetting(companyId, key, dto.value);
  }

  // ------------------------------------------
  // BRANCH MANAGEMENT
  // ------------------------------------------

  @Get('tenant/branches')
  @UseGuards(TenantGuard)
  @RequirePermissions('branch.view')
  async listBranches(@TenantId() companyId: string) {
    return this.tenantService.listBranches(companyId);
  }

  @Post('tenant/branches')
  @UseGuards(TenantGuard)
  @RequirePermissions('branch.manage')
  @HttpCode(HttpStatus.CREATED)
  async createBranch(
    @TenantId() companyId: string,
    @Body() dto: CreateBranchDto,
  ) {
    return this.tenantService.createBranch(companyId, dto);
  }

  @Get('tenant/branches/:id')
  @UseGuards(TenantGuard)
  @RequirePermissions('branch.view')
  async getBranchById(
    @TenantId() companyId: string,
    @Param('id') branchId: string,
  ) {
    return this.tenantService.getBranchById(companyId, branchId);
  }

  @Patch('tenant/branches/:id')
  @UseGuards(TenantGuard)
  @RequirePermissions('branch.manage')
  async updateBranch(
    @TenantId() companyId: string,
    @Param('id') branchId: string,
    @Body() dto: UpdateBranchDto,
  ) {
    return this.tenantService.updateBranch(companyId, branchId, dto);
  }

  @Delete('tenant/branches/:id')
  @UseGuards(TenantGuard)
  @RequirePermissions('branch.manage')
  async deleteBranch(
    @TenantId() companyId: string,
    @Param('id') branchId: string,
  ) {
    return this.tenantService.deleteBranch(companyId, branchId);
  }

  // ------------------------------------------
  // WORKING HOURS
  // ------------------------------------------

  @Get('tenant/working-hours')
  @UseGuards(TenantGuard)
  @RequirePermissions('settings.view')
  async getWorkingHours(@TenantId() companyId: string) {
    return this.tenantService.getWorkingHours(companyId);
  }

  @Put('tenant/working-hours')
  @UseGuards(TenantGuard)
  @RequirePermissions('settings.edit')
  async updateWorkingHours(
    @TenantId() companyId: string,
    @Body() dto: UpdateWorkingHoursDto,
  ) {
    return this.tenantService.updateWorkingHours(companyId, dto.schedule);
  }
}
