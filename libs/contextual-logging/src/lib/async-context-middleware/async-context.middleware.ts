import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AsyncContext } from './async-context';

@Injectable()
export class AsyncContextMiddleware implements NestMiddleware {
  constructor(private readonly asyncContext: AsyncContext) {}

  use(req: Request, res: Response, next: NextFunction) {
    const correlationId = req.headers['x-correlation-id'] as string || uuidv4();
    
    this.asyncContext.run(() => {
      res.setHeader('x-correlation-id', correlationId);
      next();
    }, correlationId);
  }
}
