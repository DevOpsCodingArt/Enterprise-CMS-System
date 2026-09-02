import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DbModule } from '../../db/db.module';
import { RedisModule } from '../../core/redis/redis.module';
import { RbacModule } from '../rbac/rbac.module';

@Module({
  imports: [DbModule, RedisModule, RbacModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
