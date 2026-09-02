import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { RequestWithUser } from '../decorators/current-user.decorator';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User is not authenticated');
    }

    // Platform Owners have global authority across all tenants
    if (user.role === 'platform_owner' || user.userType === 'platform_owner') {
      return true;
    }

    const headerTenant = request.headers['x-tenant-id'];
    const paramTenant = (request.params as Record<string, string>)?.companyId;
    const targetCompanyId = paramTenant || headerTenant;

    // If an explicit target company is requested, it must match user's company
    if (targetCompanyId && typeof targetCompanyId === 'string') {
      if (user.companyId !== targetCompanyId) {
        throw new ForbiddenException(
          'Cross-tenant access violation: You cannot access resources belonging to another ISP.',
        );
      }
    }

    // Must have an active tenant assigned
    if (!user.companyId) {
      throw new ForbiddenException(
        'No tenant company associated with this account',
      );
    }

    return true;
  }
}
