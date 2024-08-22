import {
  ExecutionContext,
  Injectable,
  Logger,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, url } = req;
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${method} ${url}`);
    next();
  }

  apiLogger(req: Request, res: Response, next: NextFunction) {
    const { method, url } = req;
    const timestamp = new Date().toISOString();
    this.logger.log(`[${timestamp}] ${method} ${url}`);
    next();
  }
}

export function logger(req: Request, res: Response, next: NextFunction) {
  const { method, url, body, query, params } = req;
  const timestamp = new Date().toISOString();
  // console.log(req.body);
  // console.log(req.params);
  // console.log(req.query)
  console.log(`[${timestamp}] ${method} ${url} `);
  next();
}
