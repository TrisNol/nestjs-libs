# gql-live-query

`gql-live-query` adds Redis-backed GraphQL live-query support to NestJS applications. It uses a local in-memory live-query store in each application instance and Redis to broadcast invalidations between instances.

When application data changes, invalidate the GraphQL resource that depends on it. Connected clients that execute a query with the `@live` directive receive the query's updated result over `graphql-ws`.

## Requirements

- A running Redis instance.
- A NestJS GraphQL application using the Apollo driver.
- The `graphql-ws`, `@n1ru4l/graphql-live-query`, and `graphql` packages available to the application.

## Usage

1. Install the library and its peer dependencies.
2. Register `GqlLiveQueryModule` with the Redis connection URL.
3. Configure the NestJS GraphQL module to use the live-query directive and the injected store's `execute` wrapper.

```ts
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLLiveDirective, NoLiveMixedWithDeferStreamRule } from '@n1ru4l/graphql-live-query';
import { GqlLiveQueryModule, RedisLiveQueryStore } from '@org/gql-live-query';
import { execute, subscribe } from 'graphql';

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
				autoSchemaFile: true,
				subscriptions: {
					'graphql-ws': {
						execute: liveQueryStore.makeExecute(execute),
						subscribe,
					} as any,
				},
				buildSchemaOptions: {
					directives: [GraphQLLiveDirective],
				},
				validationRules: [NoLiveMixedWithDeferStreamRule],
			}),
		}),
	],
})
export class AppModule {}
```

`GqlLiveQueryModule` is global and exports `RedisLiveQueryStore`, so it can be injected into services that change data.

## Invalidate Live Queries

Call `invalidate()` after changing data that a live query reads. Use the resource identifier associated with that query. For a query resolver named `exampleQuery`, the identifier is `Query.exampleQuery`.

```ts
import { Injectable } from '@nestjs/common';
import { RedisLiveQueryStore } from '@org/gql-live-query';

@Injectable()
export class ExampleDataService {
	constructor(private readonly liveQueryStore: RedisLiveQueryStore) {}

	async updateData(value: string) {
		// Persist the updated value here.
		await this.liveQueryStore.invalidate('Query.exampleQuery');
	}
}
```

`invalidate()` accepts either one identifier or an array of identifiers. Each invalidation is published through Redis, causing every application instance to refresh its matching local live queries.

## Execute a Live Query

Connect a `graphql-ws` client to the GraphQL WebSocket endpoint and include the `@live` directive in the query.

```ts
import { createClient } from 'graphql-ws';

const client = createClient({
	url: 'ws://localhost:3000/graphql',
});

client.subscribe(
	{
		query: `
			query ExampleLiveQuery @live {
				exampleQuery
			}
		`,
	},
	{
		next: (result) => console.log(result),
		error: (error) => console.error(error),
		complete: () => console.log('Live query completed'),
	},
);
```

The client receives an initial result, followed by a new result whenever `Query.exampleQuery` is invalidated.
