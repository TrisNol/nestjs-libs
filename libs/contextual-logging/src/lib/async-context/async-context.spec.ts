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
describe('AsyncContext', () => {
  let asyncContext: AsyncContext;

  beforeEach(() => {
    asyncContext = new AsyncContext();
  });

  it('should store and retrieve the correlationId', () => {
    const correlationId = '12345';
    asyncContext.run(() => {
      const retrievedCorrelationId = asyncContext.getCorrelationId();
      expect(retrievedCorrelationId).toBe(correlationId);
    }, correlationId);
  });

  it('should return undefined if no correlationId is set', () => {
    const correlationId = asyncContext.getCorrelationId();
    expect(correlationId).toBeUndefined();
  });

  it('should isolate correlationId between different runs', () => {
    const correlationId1 = '12345';
    const correlationId2 = '67890';

    asyncContext.run(() => {
      expect(asyncContext.getCorrelationId()).toBe(correlationId1);
      asyncContext.run(() => {
        expect(asyncContext.getCorrelationId()).toBe(correlationId2);
      }, correlationId2);
      expect(asyncContext.getCorrelationId()).toBe(correlationId1);
    }, correlationId1);
  });
});