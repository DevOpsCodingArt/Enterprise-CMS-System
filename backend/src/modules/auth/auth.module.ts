import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RateLimitGuard } from '../../core/guards/rate-limit.guard';
import { DbModule } from '../../db/db.module';
import { RedisModule } from '../../core/redis/redis.module';

@Module({
  imports: [
    ConfigModule,
    DbModule,
    RedisModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get<string>('jwt.accessSecret') ||
          process.env.JWT_ACCESS_SECRET ||
          'prime_one_access_secret_key_2026_super_secure_entropy_string',
        signOptions: {
          expiresIn: 900, // 15 minutes in seconds
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, RateLimitGuard],
  exports: [AuthService, JwtStrategy, JwtAuthGuard, RateLimitGuard, JwtModule],
})
export class AuthModule {}
