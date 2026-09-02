import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { DbModule } from '../../db/db.module';
import { RedisModule } from '../../core/redis/redis.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DbModule, RedisModule, AuthModule],
  controllers: [TenantController],
  providers: [TenantService],
  exports: [TenantService],
})
export class TenantModule {}
