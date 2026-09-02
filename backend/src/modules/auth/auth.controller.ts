import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
  Ip,
  Headers,
} from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { AuthService } from './auth.service';
import { LoginDto, CustomerLoginDto, PlatformLoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SendOtpDto, VerifyOtpDto } from './dto/otp.dto';
import { Public } from '../../core/decorators/public.decorator';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../core/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';

@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 1. Staff & Company Owner Login
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async loginStaff(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: FastifyReply,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const result = await this.authService.loginStaff(dto, ip, userAgent);

    // Set Edge proxy cookie
    res.setCookie('prime_access_token', result.accessToken, {
      path: '/',
      httpOnly: false, // Accessible by Next.js Edge proxy & client
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    res.setCookie('prime_refresh_token', result.refreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    return result;
  }

  /**
   * 2. Customer Portal Login
   */
  @Public()
  @Post('login/customer')
  @HttpCode(HttpStatus.OK)
  async loginCustomer(
    @Body() dto: CustomerLoginDto,
    @Res({ passthrough: true }) res: FastifyReply,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const result = await this.authService.loginCustomer(dto, ip, userAgent);

    res.setCookie('prime_access_token', result.accessToken, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    res.setCookie('prime_refresh_token', result.refreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    return result;
  }

  /**
   * 3. Platform Super-Admin Login
   */
  @Public()
  @Post('login/platform')
  @HttpCode(HttpStatus.OK)
  async loginPlatformOwner(
    @Body() dto: PlatformLoginDto,
    @Res({ passthrough: true }) res: FastifyReply,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const result = await this.authService.loginPlatformOwner(
      dto,
      ip,
      userAgent,
    );

    res.setCookie('prime_access_token', result.accessToken, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    return result;
  }

  /**
   * 4. Refresh Token Rotation
   */
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Body() dto: RefreshTokenDto,
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const token = dto.refreshToken || req.cookies.prime_refresh_token || '';
    const result = await this.authService.refreshTokens(token);

    res.setCookie('prime_access_token', result.accessToken, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    res.setCookie('prime_refresh_token', result.refreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    return result;
  }

  /**
   * 5. Logout & Session Invalidation
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser() user: AuthenticatedUser,
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const refreshToken = req.cookies.prime_refresh_token;
    const result = await this.authService.logout(user.id, refreshToken);

    res.clearCookie('prime_access_token', { path: '/' });
    res.clearCookie('prime_refresh_token', { path: '/' });

    return result;
  }

  /**
   * 6. Get Current User Profile (/auth/me)
   */
  @Get('me')
  async getMe(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.getMe(user.id, user.userType);
  }

  /**
   * 7. Send Email OTP
   */
  @Public()
  @Post('otp/send')
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto);
  }

  /**
   * 8. Verify Email OTP
   */
  @Public()
  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }
}
