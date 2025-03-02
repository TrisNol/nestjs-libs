import { Injectable, OnModuleInit } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingContextManager implements OnModuleInit {
    private asyncLocalStorage: AsyncLocalStorage<Map<string, any>> = new AsyncLocalStorage<Map<string, any>>();

    onModuleInit() {
        this.asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>();
    }

    async runInContext<T>(fn: (...args: any[]) => Promise<T>): Promise<T> {
        const store = new Map<string, any>();
        store.set('correlationId', uuidv4());
        return this.asyncLocalStorage.run(store, fn);
    }

    getCorrelationId(): string | undefined {
        const store = this.asyncLocalStorage.getStore();
        return store ? store.get('correlationId') : undefined;
    }
}