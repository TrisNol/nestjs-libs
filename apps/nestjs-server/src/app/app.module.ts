import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntitiesModule } from './entities/entities.module';
import { McpServerModule } from '@org/mcp-server';

import { NestJSTypeormTransactionalModule } from '@org/nestjs-typeorm-transactional';
import { ContextualLoggingModule } from '@org/contextual-logging'
import { InMemoryBufferStorage, BufferedMqttAdapterModule } from '@org/buffered-mqtt-adapter';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GraphqlModule } from './graphql/graphql.module';
import { AnotherTool, HeresyTool } from './mcp-example.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }),
    BufferedMqttAdapterModule.forRoot(
      {
        url: "mqtt://host.docker.internal:1883",
        clientId: "nestjs-server"
      },
      new InMemoryBufferStorage()
    ),
    EventEmitterModule.forRoot(),
    EntitiesModule,
    NestJSTypeormTransactionalModule,
    ContextualLoggingModule,
    GraphqlModule,
    McpServerModule.forRoot({
      name: 'Mock Server',
      version: '420.666.69',
      description: 'A server for the Model Context Protocol',
      websiteUrl: 'http://localhost:3000',
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    HeresyTool,
    AnotherTool
  ],
})
export class AppModule { }
