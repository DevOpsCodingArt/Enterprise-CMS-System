import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { DbModule } from '../../db/db.module';
import { RedisModule } from '../../core/redis/redis.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DbModule, RedisModule, AuthModule],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
