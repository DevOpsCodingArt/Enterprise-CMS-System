import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { DbService } from '../../db/db.service';
import { RequestWithUser } from '../decorators/current-user.decorator';

@Injectable()
export class TenantContextInterceptor implements NestInterceptor {
  constructor(private readonly dbService: DbService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    const headerTenant = request.headers['x-tenant-id'];
    const companyId =
      user?.companyId ||
      (typeof headerTenant === 'string' ? headerTenant : null);

    if (companyId) {
      // Set PostgreSQL Row-Level Security tenant context variable
      await this.dbService.setTenantContext(companyId);
    }

    return next.handle();
  }
}
