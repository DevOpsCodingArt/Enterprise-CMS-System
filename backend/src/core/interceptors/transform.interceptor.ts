import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  error: null;
  meta?: {
    timestamp: string;
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    [key: string]: unknown;
  };
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data: unknown) => {
        // If the controller already returned a custom meta envelope
        if (
          data &&
          typeof data === 'object' &&
          'data' in data &&
          'meta' in data
        ) {
          const resObj = data as { data: T; meta: Record<string, unknown> };
          return {
            success: true,
            data: resObj.data,
            error: null,
            meta: {
              timestamp: new Date().toISOString(),
              ...resObj.meta,
            },
          };
        }

        return {
          success: true,
          data: (data !== undefined ? data : null) as T,
          error: null,
          meta: {
            timestamp: new Date().toISOString(),
          },
        };
      }),
    );
  }
}
