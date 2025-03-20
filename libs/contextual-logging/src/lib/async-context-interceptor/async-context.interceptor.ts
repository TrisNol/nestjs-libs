import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { AsyncContext } from "../async-context/async-context";
import { Observable } from "rxjs";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AsyncContextInterceptor implements NestInterceptor {
    constructor(
        private readonly asyncContext: AsyncContext
    ) { }

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const client = context.getType();

        let correlationId: string;

        if (client === 'rpc') {
            // Message from Kafka, MQTT, RabbitMQ
            const ctx = context.switchToRpc();
            const data = ctx.getData();
            correlationId = data?.headers?.['x-correlation-id'] || uuidv4();
        } else {
            correlationId = uuidv4(); // Fallback for unexpected cases
        }

        return this.asyncContext.run(() =>
            next.handle(),
            correlationId
        );
    }
}