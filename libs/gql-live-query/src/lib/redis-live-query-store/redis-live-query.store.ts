import Redis from "ioredis";
import {
    InMemoryLiveQueryStore,
} from "@n1ru4l/in-memory-live-query-store";
import { execute as defaultExecute } from "graphql";
import { Inject, Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import { REDIS_LIVE_QUERY_OPTIONS } from "./redis-live-query.constants";
import { RedisLiveQueryModuleOptions } from "./redis-live-query.interface";

const CHANNEL = "LIVE_QUERY_INVALIDATIONS";


@Injectable()
export class RedisLiveQueryStore implements OnModuleDestroy {
    private readonly logger = new Logger(RedisLiveQueryStore.name);

    private pubClient: Redis;
    private subClient: Redis;
    private liveQueryStore: InMemoryLiveQueryStore;

    constructor(@Inject(REDIS_LIVE_QUERY_OPTIONS) options: RedisLiveQueryModuleOptions) {
        const { redisUrl, storeParameter } = options;
        this.pubClient = new Redis(redisUrl);
        this.subClient = new Redis(redisUrl);
        this.logger.log("Connected to Redis");
        this.liveQueryStore = new InMemoryLiveQueryStore(storeParameter);

        this.subClient.subscribe(CHANNEL, (err) => {
            if (err) throw err;
        });

        this.subClient.on("message", (channel, resourceIdentifier) => {
            if (channel === CHANNEL && resourceIdentifier)
                this.liveQueryStore.invalidate(resourceIdentifier);
        });
    }

    /**
     * Gracefully close Redis connections when the module is destroyed
     */
    onModuleDestroy() {
        this.logger.log("Shutting down");
        if (this.pubClient)
            this.pubClient.quit();
        if (this.subClient)
            this.subClient.quit();
    }

    async invalidate(identifiers: Array<string> | string) {
        if (typeof identifiers === "string") {
            identifiers = [identifiers];
        }
        for (const identifier of identifiers) {
            this.pubClient.publish(CHANNEL, identifier);
        }
    }

    makeExecute(execute: typeof defaultExecute) {
        return this.liveQueryStore.makeExecute(execute);
    }
}