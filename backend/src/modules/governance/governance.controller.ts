import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { GovernanceService } from './governance.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { TenantGuard } from '../../core/guards/tenant.guard';
import { TenantId } from '../../core/decorators/tenant-id.decorator';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../core/decorators/current-user.decorator';

@Controller('governance')
@UseGuards(JwtAuthGuard, TenantGuard)
export class GovernanceController {
  constructor(private readonly governanceService: GovernanceService) {}

  @Get('sla-rules')
  async getSlaRules(@TenantId() companyId: string) {
    return this.governanceService.getSlaRules(companyId);
  }

  @Post('sla-rules')
  async createSlaRule(@TenantId() companyId: string, @Body() body: any) {
    return this.governanceService.createSlaRule(companyId, body);
  }

  @Get('canned-shortcuts')
  async getCannedShortcuts(@TenantId() companyId: string) {
    return this.governanceService.getCannedShortcuts(companyId);
  }

  @Post('canned-shortcuts')
  async createCannedShortcut(
    @TenantId() companyId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: any,
  ) {
    return this.governanceService.createCannedShortcut(companyId, user.id, body);
  }
}
