import { DynamicModule, Module } from "@nestjs/common";
import { RedisLiveQueryStore } from "./redis-live-query-store/redis-live-query.store";
import { REDIS_LIVE_QUERY_OPTIONS } from "./redis-live-query-store/redis-live-query.constants";
import { RedisLiveQueryModuleOptions } from "./redis-live-query-store/redis-live-query.interface";

@Module({})
export class GqlLiveQueryModule {
  static forRoot(options: RedisLiveQueryModuleOptions): DynamicModule {
    return {
      global: true,
      module: GqlLiveQueryModule,
      providers: [
        {
          provide: REDIS_LIVE_QUERY_OPTIONS,
          useValue: options,
        },
        RedisLiveQueryStore,
      ],
      exports: [RedisLiveQueryStore],
    };
  }
}