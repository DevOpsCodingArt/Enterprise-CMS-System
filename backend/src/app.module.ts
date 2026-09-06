import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { RedisModule } from './core/redis/redis.module';
import { databaseConfig } from './config/database.config';
import { redisConfig } from './config/redis.config';
import { jwtConfig } from './config/jwt.config';
import { s3Config } from './config/s3.config';
import { AuthModule } from './modules/auth/auth.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { CustomerModule } from './modules/customer/customer.module';
import { RbacModule } from './modules/rbac/rbac.module';
import { UsersModule } from './modules/users/users.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { PackagesModule } from './modules/packages/packages.module';
import { ConnectionsModule } from './modules/connections/connections.module';
import { WorkforceModule } from './modules/workforce/workforce.module';
import { GovernanceModule } from './modules/governance/governance.module';
import { ChatModule } from './modules/chat/chat.module';
import { validateEnv } from './config/env.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: validateEnv,
      load: [databaseConfig, redisConfig, jwtConfig, s3Config],
    }),
    DbModule,
    RedisModule,
    AuthModule,
    TenantModule,
    CustomerModule,
    RbacModule,
    UsersModule,
    TicketsModule,
    PackagesModule,
    ConnectionsModule,
    WorkforceModule,
    GovernanceModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
