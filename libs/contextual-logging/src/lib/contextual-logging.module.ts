import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ContextLoggingService } from './context-logging-service/context-logging.service';

import { AsyncContextMiddleware } from './async-context-middleware/async-context.middleware';
import { AsyncContext } from './async-context/async-context'

@Module({
  controllers: [],
  providers: [AsyncContext, ContextLoggingService],
  exports: [AsyncContext, ContextLoggingService],
})
export class ContextualLoggingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AsyncContextMiddleware).forRoutes('*');
  }
}
