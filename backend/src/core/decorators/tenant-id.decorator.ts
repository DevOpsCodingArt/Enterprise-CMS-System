import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from './current-user.decorator';

export const TenantId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    const headerTenant = request.headers['x-tenant-id'];

    if (user?.companyId) {
      return user.companyId;
    }

    if (typeof headerTenant === 'string') {
      return headerTenant;
    }

    return null;
  },
);
