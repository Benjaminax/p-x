import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorPayload {
  error: true;
  code: string;
  message: string;
  timestamp: string;
}

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const payload = this.resolvePayload(exception, status);

    response.status(status).json({
      ...payload,
      path: request.url,
    });
  }

  private resolvePayload(exception: unknown, status: number): ErrorPayload {
    if (exception instanceof HttpException) {
      const raw = exception.getResponse();

      if (typeof raw === 'string') {
        return {
          error: true,
          code: this.defaultCode(status),
          message: raw,
          timestamp: new Date().toISOString(),
        };
      }

      if (typeof raw === 'object' && raw !== null) {
        const candidate = raw as Record<string, unknown>;
        const message = Array.isArray(candidate.message)
          ? candidate.message.join(', ')
          : String(candidate.message ?? 'Request failed');

        return {
          error: true,
          code: String(candidate.code ?? this.defaultCode(status)),
          message,
          timestamp: new Date().toISOString(),
        };
      }
    }

    return {
      error: true,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred. Please try again later.',
      timestamp: new Date().toISOString(),
    };
  }

  private defaultCode(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'BAD_REQUEST';
      case HttpStatus.UNAUTHORIZED:
        return 'UNAUTHORIZED';
      case HttpStatus.FORBIDDEN:
        return 'FORBIDDEN';
      case HttpStatus.NOT_FOUND:
        return 'NOT_FOUND';
      case HttpStatus.CONFLICT:
        return 'CONFLICT';
      case HttpStatus.TOO_MANY_REQUESTS:
        return 'RATE_LIMIT_EXCEEDED';
      default:
        return 'REQUEST_FAILED';
    }
  }
}
