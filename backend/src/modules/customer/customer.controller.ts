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
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerQueryDto } from './dto/customer-query.dto';
import { UpdatePortalProfileDto } from './dto/portal-profile.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { TenantGuard } from '../../core/guards/tenant.guard';
import { PermissionGuard } from '../../core/guards/permission.guard';
import { RequirePermissions } from '../../core/decorators/require-permissions.decorator';
import { TenantId } from '../../core/decorators/tenant-id.decorator';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../core/decorators/current-user.decorator';

@Controller()
@UseGuards(JwtAuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // ==========================================
  // STAFF CRM SUBSCRIBER ENDPOINTS (/api/v1/customers)
  // ==========================================

  @Get('customers')
  @UseGuards(TenantGuard, PermissionGuard)
  @RequirePermissions('customer.view')
  async listCustomers(
    @TenantId() companyId: string,
    @Query() query: CustomerQueryDto,
  ) {
    return this.customerService.listCustomers(companyId, query);
  }

  @Post('customers')
  @UseGuards(TenantGuard, PermissionGuard)
  @RequirePermissions('customer.create')
  @HttpCode(HttpStatus.CREATED)
  async createCustomer(
    @TenantId() companyId: string,
    @Body() dto: CreateCustomerDto,
  ) {
    return this.customerService.createCustomer(companyId, dto);
  }

  @Get('customers/:id/360')
  @UseGuards(TenantGuard, PermissionGuard)
  @RequirePermissions('customer.view_360')
  async getCustomer360(
    @TenantId() companyId: string,
    @Param('id') customerId: string,
  ) {
    return this.customerService.getCustomer360(companyId, customerId);
  }

  @Get('customers/:id/tickets')
  @UseGuards(TenantGuard, PermissionGuard)
  @RequirePermissions('customer.view')
  async getCustomerTickets(
    @TenantId() companyId: string,
    @Param('id') customerId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.customerService.getCustomerTickets(
      companyId,
      customerId,
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
  }

  @Get('customers/:id/conversations')
  @UseGuards(TenantGuard, PermissionGuard)
  @RequirePermissions('customer.view')
  async getCustomerConversations(
    @TenantId() companyId: string,
    @Param('id') customerId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.customerService.getCustomerConversations(
      companyId,
      customerId,
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
  }

  @Get('customers/:id')
  @UseGuards(TenantGuard, PermissionGuard)
  @RequirePermissions('customer.view')
  async getCustomerById(
    @TenantId() companyId: string,
    @Param('id') customerId: string,
  ) {
    return this.customerService.getCustomerById(companyId, customerId);
  }

  @Patch('customers/:id')
  @UseGuards(TenantGuard, PermissionGuard)
  @RequirePermissions('customer.edit')
  async updateCustomer(
    @TenantId() companyId: string,
    @Param('id') customerId: string,
    @Body() dto: UpdateCustomerDto,
  ) {
    return this.customerService.updateCustomer(companyId, customerId, dto);
  }

  @Delete('customers/:id')
  @UseGuards(TenantGuard, PermissionGuard)
  @RequirePermissions('customer.edit')
  async deleteCustomer(
    @TenantId() companyId: string,
    @Param('id') customerId: string,
  ) {
    return this.customerService.deleteCustomer(companyId, customerId);
  }

  // ==========================================
  // SUBSCRIBER SELF-CARE PORTAL (/api/v1/portal)
  // ==========================================

  @Get('portal/profile')
  async getPortalProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.customerService.getPortalProfile(user.id, user.companyId!);
  }

  @Patch('portal/profile')
  async updatePortalProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdatePortalProfileDto,
  ) {
    return this.customerService.updatePortalProfile(
      user.id,
      user.companyId!,
      dto,
    );
  }

  @Get('portal/diagnostics')
  async getPortalDiagnostics(@CurrentUser() user: AuthenticatedUser) {
    return this.customerService.getPortalDiagnostics(user.id, user.companyId!);
  }

  @Get('portal/billing')
  async getPortalBilling(@CurrentUser() user: AuthenticatedUser) {
    return this.customerService.getPortalBilling(user.id, user.companyId!);
  }
}
