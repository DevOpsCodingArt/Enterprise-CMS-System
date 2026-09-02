import { Module } from '@nestjs/common';
import { RbacService } from './rbac.service';
import { RbacController } from './rbac.controller';
import { DbModule } from '../../db/db.module';
import { RedisModule } from '../../core/redis/redis.module';

@Module({
  imports: [DbModule, RedisModule],
  controllers: [RbacController],
  providers: [RbacService],
  exports: [RbacService],
})
export class RbacModule {}
