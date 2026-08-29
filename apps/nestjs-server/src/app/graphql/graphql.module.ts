import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Injectable, Logger, Module } from '@nestjs/common';
import { GraphQLModule, Query, Resolver } from '@nestjs/graphql';
import { GqlLiveQueryModule, RedisLiveQueryStore } from '@org/gql-live-query';
import { GraphQLLiveDirective } from '@n1ru4l/graphql-live-query';
import { NoLiveMixedWithDeferStreamRule } from '@n1ru4l/graphql-live-query';
import { execute, subscribe } from 'graphql';
import { ExampleLiveQueryController } from './example-live-query.controller';

@Injectable()
export class TmpDataService {
    private data = "Initial data";

    constructor(private readonly liveQueryStore: RedisLiveQueryStore) {
        // setInterval(() => {
        //     const data = `Updated data at ${new Date().toISOString()}`;
        //     this.updateData(data);
        //     Logger.log(`Data updated: ${data}`);
        // }, 5000);
    }

    getData(): string {
        return this.data;
    }

    updateData(newData: string) {
        this.data = newData;
        // Invalidate live queries subscribed to this data
        this.liveQueryStore.invalidate("Query.exampleQuery");
    }
}

@Resolver(() => String)
export class ExampleModelResolver {
    constructor(private tmpDataService: TmpDataService) {}

    @Query(() => String)
    exampleQuery(): string {
        return this.tmpDataService.getData();
    }
}

@Module({
    imports: [
        GqlLiveQueryModule.forRoot({
            redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
        }),
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            driver: ApolloDriver,
            inject: [RedisLiveQueryStore],
            useFactory: (liveQueryStore: RedisLiveQueryStore) => ({
                path: '/graphql',
                graphiql: true,
                autoSchemaFile: true,
                // Utilize graphql-ws to fuel GraphQL subscriptions and live queries
                subscriptions: {
                    'graphql-ws': {
                        // Configure graphql-ws to use the live query store's execute wrapper
                        execute: liveQueryStore.makeExecute(execute),
                        subscribe,
                    } as any, // Type assertion needed as NestJS types don't include execute/subscribe
                },
                // Embed the @live directive into the schema
                buildSchemaOptions: {
                    directives: [GraphQLLiveDirective],
                },
                // Add validation rule for @live directive
                validationRules: [NoLiveMixedWithDeferStreamRule],
            }),
        }),
    ],
    providers: [
        ExampleModelResolver,
        TmpDataService
    ],
    controllers: [ExampleLiveQueryController],
    exports: []
})
export class GraphqlModule { }