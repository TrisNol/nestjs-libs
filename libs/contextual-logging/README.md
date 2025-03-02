# contextual-logging

This library provides the means perform contextual logging by passing a [Correlation ID](https://microsoft.github.io/code-with-engineering-playbook/observability/correlation-id/) down the async. callstack within a NestJS app.

By utilizing this mechanism it's possible to track the flow of logs by the means of the `correlationID` and `timestamp` of a log, which becomes increasingly helpful in asynchronous applications where multiple requests/events are handled in parallel.
## Usage

1. Install the lib.
2. Import the `ContextualLoggingModule` in your `AppModule`:

    ```ts
    import { ContextualLoggingModule } from '@org/contextual-logging'

    @Module({
        imports: [
            /** other imports **/
            ContextualLoggingModule
        ],
        /** providers, etc. **/
    })
    export class AppModule {}
    ```

    This will automatically register the [AsyncContextMiddleware](./src/lib/async-context-middleware/async-context.middleware.ts) for all incoming HTTP requests.
3. Override the global `Logger` instance in your `main.ts`:

    ```ts
    import { Logger } from '@nestjs/common';
    import { NestFactory } from '@nestjs/core';
    import { AppModule } from './app/app.module';

    import { ContextLoggingService } from '@org/contextual-logging';

    async function bootstrap() {
        const app = await NestFactory.create(AppModule, {
            bufferLogs: true // 👈 Required as the Logger is defined below 
        });
        app.useLogger(app.get(ContextLoggingService));
       /** all the rest **/
    }

    bootstrap();
    ```
4. Depending on your use case, utilize the [AsyncContextual() decorator](./src/lib/async-context-decorator/async-context.decorator.ts) or [AsyncContext interceptor](./src/lib/async-context-interceptor/async-context.interceptor.ts) to further integrate contextual logging in your app.
