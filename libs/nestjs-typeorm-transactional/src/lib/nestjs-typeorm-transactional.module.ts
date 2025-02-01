import { Module } from '@nestjs/common';
import { TransactionManager } from './transaction-manager/transaction-manager.service';

@Module({
  controllers: [],
  providers: [TransactionManager],
  exports: [TransactionManager],
})
export class NestJSTypeormTransactionalModule {}
