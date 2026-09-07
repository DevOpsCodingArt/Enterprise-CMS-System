import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { TenantGuard } from '../../core/guards/tenant.guard';
import { TenantId } from '../../core/decorators/tenant-id.decorator';

@Controller('connections')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @Get()
  async listLeads(
    @TenantId() companyId: string,
    @Query('stage') stage?: string,
  ) {
    return this.connectionsService.listLeads(companyId, stage);
  }

  @Get('leads')
  async listLeadsAlias(
    @TenantId() companyId: string,
    @Query('stage') stage?: string,
  ) {
    return this.connectionsService.listLeads(companyId, stage);
  }

  @Get(':id')
  async getLeadById(@TenantId() companyId: string, @Param('id') id: string) {
    return this.connectionsService.getLeadById(companyId, id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createLead(@TenantId() companyId: string, @Body() body: any) {
    return this.connectionsService.createLead(companyId, body);
  }

  @Patch(':id')
  async updateLead(
    @TenantId() companyId: string,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.connectionsService.updateLead(companyId, id, body);
  }
}
