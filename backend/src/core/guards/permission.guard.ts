import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';
import { RequestWithUser } from '../decorators/current-user.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User is not authenticated');
    }

    // Platform Super-Admins & Company Owners have full authority
    if (
      user.role === 'platform_owner' ||
      user.userType === 'platform_owner' ||
      user.role === 'company_owner' ||
      user.permissions.includes('*') ||
      user.permissions.includes('*.*')
    ) {
      return true;
    }

    const userPermissions = user.permissions || [];

    // Check if user has all required permissions
    const hasAll = requiredPermissions.every((required) => {
      if (userPermissions.includes(required)) return true;

      // Module wildcard matching (e.g. 'chat.*' satisfies 'chat.view')
      const domain = required.split('.')[0];
      if (userPermissions.includes(`${domain}.*`)) return true;

      return false;
    });

    if (!hasAll) {
      throw new ForbiddenException(
        `Insufficient privileges. Required permissions: [${requiredPermissions.join(', ')}]`,
      );
    }

    return true;
  }
}
