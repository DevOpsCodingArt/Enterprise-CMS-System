import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { DbModule } from '../../db/db.module';
import { RedisModule } from '../../core/redis/redis.module';

@Module({
  imports: [DbModule, RedisModule],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}
