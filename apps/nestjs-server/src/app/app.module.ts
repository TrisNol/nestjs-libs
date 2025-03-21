import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntitiesModule } from './entities/entities.module';

import { NestJSTypeormTransactionalModule } from '@org/nestjs-typeorm-transactional';
import { ContextualLoggingModule } from '@org/contextual-logging'
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }),
    EventEmitterModule.forRoot(),
    EntitiesModule,
    NestJSTypeormTransactionalModule,
    ContextualLoggingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
