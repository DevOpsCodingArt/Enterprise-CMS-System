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
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AssignTicketDto } from './dto/assign-ticket.dto';
import { ResolveTicketDto } from './dto/resolve-ticket.dto';
import { CloseTicketDto } from './dto/close-ticket.dto';
import { AddTicketActivityDto } from './dto/add-activity.dto';
import { TicketQueryDto } from './dto/ticket-query.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { TenantGuard } from '../../core/guards/tenant.guard';
import { PermissionGuard } from '../../core/guards/permission.guard';
import { RequirePermissions } from '../../core/decorators/require-permissions.decorator';
import { TenantId } from '../../core/decorators/tenant-id.decorator';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../core/decorators/current-user.decorator';

@Controller('tickets')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  @RequirePermissions('ticket.view')
  async listTickets(
    @TenantId() companyId: string,
    @Query() query: TicketQueryDto,
  ) {
    return this.ticketsService.listTickets(companyId, query);
  }

  @Post()
  @RequirePermissions('ticket.create')
  @HttpCode(HttpStatus.CREATED)
  async createTicket(
    @TenantId() companyId: string,
    @Body() dto: CreateTicketDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.ticketsService.createTicket(companyId, dto, currentUser.id);
  }

  @Get(':id')
  @RequirePermissions('ticket.view')
  async getTicketById(
    @TenantId() companyId: string,
    @Param('id') ticketId: string,
  ) {
    return this.ticketsService.getTicketById(companyId, ticketId);
  }

  @Patch(':id')
  @RequirePermissions('ticket.update_status')
  async updateTicket(
    @TenantId() companyId: string,
    @Param('id') ticketId: string,
    @Body() dto: UpdateTicketDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.ticketsService.updateTicket(
      companyId,
      ticketId,
      dto,
      currentUser.id,
    );
  }

  @Delete(':id')
  @RequirePermissions('ticket.delete')
  async deleteTicket(
    @TenantId() companyId: string,
    @Param('id') ticketId: string,
  ) {
    return this.ticketsService.deleteTicket(companyId, ticketId);
  }

  @Post(':id/assign')
  @RequirePermissions('ticket.assign')
  async assignTicket(
    @TenantId() companyId: string,
    @Param('id') ticketId: string,
    @Body() dto: AssignTicketDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.ticketsService.assignTicket(
      companyId,
      ticketId,
      dto,
      currentUser.id,
    );
  }

  @Post(':id/resolve')
  @RequirePermissions('ticket.resolve')
  async resolveTicket(
    @TenantId() companyId: string,
    @Param('id') ticketId: string,
    @Body() dto: ResolveTicketDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.ticketsService.resolveTicket(
      companyId,
      ticketId,
      dto,
      currentUser.id,
    );
  }

  @Post(':id/close')
  @RequirePermissions('ticket.close')
  async closeTicket(
    @TenantId() companyId: string,
    @Param('id') ticketId: string,
    @Body() dto: CloseTicketDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.ticketsService.closeTicket(
      companyId,
      ticketId,
      dto,
      currentUser.id,
    );
  }

  @Get(':id/activities')
  @RequirePermissions('ticket.view')
  async getTicketActivities(
    @TenantId() companyId: string,
    @Param('id') ticketId: string,
  ) {
    return this.ticketsService.getTicketActivities(companyId, ticketId);
  }

  @Post(':id/activities')
  @RequirePermissions('ticket.update_status')
  @HttpCode(HttpStatus.CREATED)
  async addTicketActivity(
    @TenantId() companyId: string,
    @Param('id') ticketId: string,
    @Body() dto: AddTicketActivityDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.ticketsService.addTicketActivity(
      companyId,
      ticketId,
      dto,
      currentUser.id,
    );
  }
}
