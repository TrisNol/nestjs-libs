import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class AsyncContext implements OnModuleDestroy{
  
  private static readonly key = 'correlationId';
  private storage = new AsyncLocalStorage<Map<string, string>>();

  run<T>(callback: () => T, correlationId: string): T {
    const store = new Map<string, string>();
    store.set(AsyncContext.key, correlationId);
    return this.storage.run(store, callback);
  }

  getCorrelationId(): string | undefined {
    return this.storage.getStore()?.get(AsyncContext.key);
  }

  onModuleDestroy() {
    this.storage.disable();
  }
}
