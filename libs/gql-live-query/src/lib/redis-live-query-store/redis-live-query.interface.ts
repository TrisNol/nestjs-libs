import { InMemoryLiveQueryStoreParameter } from "@n1ru4l/in-memory-live-query-store";

export interface RedisLiveQueryModuleOptions {
    redisUrl: string;
    storeParameter?: InMemoryLiveQueryStoreParameter;
}
