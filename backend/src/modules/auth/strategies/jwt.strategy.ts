import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { FastifyRequest } from 'fastify';
import { AuthenticatedUser } from '../../../core/decorators/current-user.decorator';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  companyId: string | null;
  branchId: string | null;
  permissions: string[];
  userType: 'platform_owner' | 'user' | 'customer';
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    const secret =
      configService.get<string>('jwt.accessSecret') ||
      process.env.JWT_ACCESS_SECRET ||
      'prime_one_access_secret_key_2026_super_secure_entropy_string';

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // 1. Extract from Authorization: Bearer <token>
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        // 2. Extract from cookies: prime_access_token
        (req: FastifyRequest) => {
          if (req && req.cookies && req.cookies.prime_access_token) {
            return req.cookies.prime_access_token;
          }
          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: JwtPayload): AuthenticatedUser {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      companyId: payload.companyId || null,
      branchId: payload.branchId || null,
      permissions: payload.permissions || [],
      userType: payload.userType,
    };
  }
}
