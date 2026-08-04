import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MulterError } from 'multer';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof MulterError) {
      const status = HttpStatus.BAD_REQUEST;
      response.status(status).json({
        status_code: status,
        message: exception.message,
        data: null,
        version: `${request.url.split('/')[1]?.replace('v', '') || '1'}.0.0`,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
      return;
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    let validationErrors: unknown = null;
    if (
      exceptionResponse &&
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse
    ) {
      validationErrors = exceptionResponse.message;
    }

    const version = request.url.split('/')[1]?.replace('v', '') || '1';

    response.status(status).json({
      status_code: status,
      message: validationErrors || message,
      data: null,
      version: `${version}.0.0`,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
