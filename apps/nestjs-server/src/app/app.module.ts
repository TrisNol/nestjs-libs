import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntitiesModule } from './entities/entities.module';

import { NestjsTypeormTransactionalModule } from '@org/nestjs-typeorm-transactional';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }),
    EntitiesModule,
    NestjsTypeormTransactionalModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
