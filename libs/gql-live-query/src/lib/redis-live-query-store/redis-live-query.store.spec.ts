// Mock ioredis before imports
jest.mock('ioredis', () => {
    const mockRedis = jest.fn().mockImplementation(() => ({
        subscribe: jest.fn((channel, callback) => callback?.(null)),
        on: jest.fn(),
        publish: jest.fn(),
        quit: jest.fn(),
    }));
    
    return {
        __esModule: true,
        default: mockRedis,
    };
});

import { RedisLiveQueryStore } from './redis-live-query.store';

describe(RedisLiveQueryStore.name, () => {
    let store: RedisLiveQueryStore;

    beforeAll(() => {
        store = new RedisLiveQueryStore({
            redisUrl: 'redis://localhost:6379',
        });
    });

    it('should be defined', () => {
        expect(store).toBeDefined();
    });
});
