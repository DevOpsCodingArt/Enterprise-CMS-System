import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PackagesService } from './packages.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { TenantGuard } from '../../core/guards/tenant.guard';
import { TenantId } from '../../core/decorators/tenant-id.decorator';

@Controller('packages')
@UseGuards(JwtAuthGuard, TenantGuard)
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Get()
  async listPackages(@TenantId() companyId: string) {
    return this.packagesService.listPackages(companyId);
  }

  @Get(':id')
  async getPackageById(@TenantId() companyId: string, @Param('id') id: string) {
    return this.packagesService.getPackageById(companyId, id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPackage(@TenantId() companyId: string, @Body() body: any) {
    return this.packagesService.createPackage(companyId, body);
  }

  @Patch(':id')
  async updatePackage(
    @TenantId() companyId: string,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.packagesService.updatePackage(companyId, id, body);
  }

  @Delete(':id')
  async deletePackage(@TenantId() companyId: string, @Param('id') id: string) {
    return this.packagesService.deletePackage(companyId, id);
  }
}
