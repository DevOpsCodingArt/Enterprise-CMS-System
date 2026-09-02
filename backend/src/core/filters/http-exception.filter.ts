import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

export interface ApiErrorEnvelope {
  success: false;
  data: null;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let errorMessage: string | string[] = 'An unexpected error occurred';
    let details: unknown = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        errorMessage = res;
      } else if (typeof res === 'object' && res !== null) {
        const resObj = res as Record<string, unknown>;
        if (typeof resObj.message === 'string') {
          errorMessage = resObj.message;
        } else if (Array.isArray(resObj.message)) {
          errorMessage = resObj.message.map((m) => String(m));
        }

        if (typeof resObj.error === 'string') {
          errorCode = resObj.error;
        } else {
          errorCode = this.mapStatusToErrorCode(status);
        }

        details =
          resObj.details ||
          (Array.isArray(resObj.message) ? resObj.message : null);
      }
    } else if (exception instanceof Error) {
      errorMessage = exception.message;
      this.logger.error(
        `Unhandled Exception on ${request.method} ${request.url}: ${exception.stack ?? exception.message}`,
      );
    }

    const errorPayload: ApiErrorEnvelope = {
      success: false,
      data: null,
      error: {
        code: errorCode,
        message: Array.isArray(errorMessage)
          ? errorMessage.join(', ')
          : errorMessage,
        ...(details ? { details } : {}),
      },
    };

    void response.status(status).send(errorPayload);
  }

  private mapStatusToErrorCode(status: number): string {
    const s = Number(status);
    if (s === 400) return 'BAD_REQUEST';
    if (s === 401) return 'UNAUTHORIZED';
    if (s === 403) return 'PERMISSION_DENIED';
    if (s === 404) return 'NOT_FOUND';
    if (s === 409) return 'CONFLICT';
    if (s === 422) return 'VALIDATION_ERROR';
    if (s === 429) return 'RATE_LIMIT_EXCEEDED';
    return 'INTERNAL_SERVER_ERROR';
  }
}
