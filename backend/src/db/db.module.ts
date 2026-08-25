import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbService } from './db.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    DbService,
    {
      provide: 'DRIZZLE_DB',
      useFactory: (dbService: DbService) => dbService.db,
      inject: [DbService],
    },
  ],
  exports: [DbService, 'DRIZZLE_DB'],
})
export class DbModule {}
