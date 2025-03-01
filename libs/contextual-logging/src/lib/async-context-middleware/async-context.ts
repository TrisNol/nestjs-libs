import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class AsyncContext {
  private storage = new AsyncLocalStorage<Map<string, string>>();

  run(callback: () => void, correlationId: string) {
    const store = new Map<string, string>();
    store.set('correlationId', correlationId);
    this.storage.run(store, callback);
  }

  getCorrelationId(): string | undefined {
    return this.storage.getStore()?.get('correlationId');
  }
}
