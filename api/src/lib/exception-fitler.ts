import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    if (status == 500) console.log(exception);
    let message;
    if (exception instanceof BadRequestException) {
      message = (exception as any).getResponse().message;
    } else if (exception instanceof HttpException) {
      message = exception.getResponse();
    } else if (exception instanceof PrismaClientKnownRequestError) {
      message = exception.meta.cause;
    } else if (exception instanceof Error) {
      message = exception.message;
    } else {
      message = 'Internal server error';
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    };
    this.logger.error(errorResponse);

    this.logger.error(`HTTP Status: ${status} `);

    response.status(status).json(errorResponse);
  }
}
