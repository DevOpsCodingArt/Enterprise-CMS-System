import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Socket } from 'socket.io';
import { JwtPayload } from '../../modules/auth/strategies/jwt.strategy';

interface CustomHandshake {
  auth?: { token?: string };
  query?: Record<string, string | string[]>;
  headers?: Record<string, string | string[]>;
}

@Injectable()
export class WsAuthGuard implements CanActivate {
  private readonly logger = new Logger(WsAuthGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const handshake = client.handshake as unknown as CustomHandshake;

    const authToken =
      typeof handshake.auth?.token === 'string'
        ? handshake.auth.token
        : undefined;
    const queryToken =
      typeof handshake.query?.token === 'string'
        ? handshake.query.token
        : undefined;
    const authHeader =
      typeof handshake.headers?.authorization === 'string'
        ? handshake.headers.authorization.replace('Bearer ', '')
        : undefined;

    const token = authToken || queryToken || authHeader;

    if (!token) {
      this.logger.warn(
        `WS connection rejected: Missing auth token from socket ${client.id}`,
      );
      client.disconnect(true);
      return false;
    }

    try {
      const secret =
        this.configService.get<string>('jwt.accessSecret') ||
        process.env.JWT_ACCESS_SECRET ||
        'prime_one_access_secret_key_2026_super_secure_entropy_string';

      const payload = this.jwtService.verify<JwtPayload>(token, { secret });
      (client as Socket & { user: JwtPayload }).user = payload;
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.warn(`WS token verification failed: ${msg}`);
      client.disconnect(true);
      return false;
    }
  }
}
