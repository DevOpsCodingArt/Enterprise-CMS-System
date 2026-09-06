import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WorkforceService } from './workforce.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { TenantGuard } from '../../core/guards/tenant.guard';
import { TenantId } from '../../core/decorators/tenant-id.decorator';

@Controller('workforce')
@UseGuards(JwtAuthGuard, TenantGuard)
export class WorkforceController {
  constructor(private readonly workforceService: WorkforceService) {}

  @Get('departments')
  async getDepartments(@TenantId() companyId: string) {
    return this.workforceService.getDepartments(companyId);
  }

  @Post('departments')
  async createDepartment(@TenantId() companyId: string, @Body() body: any) {
    return this.workforceService.createDepartment(companyId, body);
  }

  @Get('shifts')
  async getShifts(@TenantId() companyId: string) {
    return this.workforceService.getShifts(companyId);
  }

  @Post('shifts')
  async createShift(@TenantId() companyId: string, @Body() body: any) {
    return this.workforceService.createShift(companyId, body);
  }

  @Get('attendance')
  async getAttendance(
    @TenantId() companyId: string,
    @Query('date') dateStr?: string,
  ) {
    return this.workforceService.getAttendance(companyId, dateStr);
  }

  @Post('attendance/clock-in')
  async clockIn(@TenantId() companyId: string, @Body() body: any) {
    return this.workforceService.clockIn(companyId, body);
  }

  @Post('attendance/:id/clock-out')
  async clockOut(@TenantId() companyId: string, @Param('id') id: string) {
    return this.workforceService.clockOut(companyId, id);
  }

  @Get('tasks')
  async getTasks(
    @TenantId() companyId: string,
    @Query('status') status?: string,
  ) {
    return this.workforceService.getTasks(companyId, status);
  }

  @Patch('tasks/:id/status')
  async updateTaskStatus(
    @TenantId() companyId: string,
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.workforceService.updateTaskStatus(companyId, id, status);
  }
}
