import { Controller, Get, Logger, OnModuleInit } from '@nestjs/common';
import { createClient, Client as WSClient } from 'graphql-ws';
import WebSocket from 'ws';

@Controller('live-query-example')
export class ExampleLiveQueryController implements OnModuleInit {
    private readonly logger = new Logger(ExampleLiveQueryController.name);
    private wsClient: WSClient | null = null;
    private isWatching = false;

    async onModuleInit() {
        // Automatically start watching when the module initializes
        // Comment this out if you want to trigger it manually via the endpoint
        // setTimeout(() => this.startWatchingLiveQuery(), 2000);
    }

    @Get('start')
    async startWatchingLiveQuery() {
        if (this.isWatching) {
            return { message: 'Already watching live query' };
        }

        this.isWatching = true;
        this.logger.log('Starting to watch live query...');

        // Create WebSocket client for subscriptions/live queries
        this.wsClient = createClient({
            url: 'ws://localhost:3000/graphql',
            webSocketImpl: WebSocket,
        });

        // Define the live query with @live directive
        const liveQuery = `
            query ExampleLiveQuery @live {
                exampleQuery
            }
        `;

        // Subscribe to the live query
        const unsubscribe = this.wsClient.subscribe(
            {
                query: liveQuery,
            },
            {
                next: (result) => {
                    this.logger.log('📡 Live query update received:');
                    this.logger.log(JSON.stringify(result, null, 2));
                },
                error: (error) => {
                    this.logger.error('❌ Live query error:', error);
                },
                complete: () => {
                    this.logger.log('✅ Live query completed');
                },
            }
        );

        return {
            message: 'Started watching live query. Check server logs for updates.',
            query: liveQuery,
            note: 'The query will automatically receive updates when data changes',
        };
    }

    @Get('stop')
    async stopWatchingLiveQuery() {
        if (this.wsClient) {
            await this.wsClient.dispose();
            this.wsClient = null;
            this.isWatching = false;
            this.logger.log('Stopped watching live query');
            return { message: 'Stopped watching live query' };
        }
        return { message: 'No active live query to stop' };
    }

    @Get('status')
    getStatus() {
        return {
            isWatching: this.isWatching,
            endpoints: {
                start: '/live-query-example/start',
                stop: '/live-query-example/stop',
                status: '/live-query-example/status',
            },
            instructions: [
                '1. Start the live query watcher: GET /live-query-example/start',
                '2. Watch the server logs to see live updates every 5 seconds',
                '3. Stop watching: GET /live-query-example/stop',
            ],
        };
    }
}
