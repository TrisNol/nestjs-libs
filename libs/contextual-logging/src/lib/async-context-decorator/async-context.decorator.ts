import { Inject } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';
import { AsyncContext } from "../async-context/async-context";

export function AsyncContextual() {
    const injectAsyncContext = Inject(AsyncContext);

    return function (
        target: object,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) {
        injectAsyncContext(target, "asyncContext");
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: unknown[]) {
            const correlationId = (this as { asyncContext: AsyncContext }).asyncContext.getCorrelationId() ?? uuidv4();
            return (this as { asyncContext: AsyncContext }).asyncContext.run(() => {
                return originalMethod.apply(this, args);
            }, correlationId);
        };

        return descriptor;
    };
}