import { Injectable, OnModuleInit } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { DataSource } from 'typeorm';
import { QueryRunner } from 'typeorm';

import { v4 as uuid } from 'uuid';

@Injectable()
export class TransactionManager implements OnModuleInit {
  private asyncLocalStorage: AsyncLocalStorage<{ queryRunner: QueryRunner, id: string }> = new AsyncLocalStorage<{ queryRunner: QueryRunner, id: string }>();

  constructor(private readonly dataSource: DataSource) { }

  onModuleInit() {
    this.asyncLocalStorage = new AsyncLocalStorage<{ queryRunner: QueryRunner, id: string }>();
  }

  /**
   * Executes the given function within a transaction context.
   * @param fn The function to execute within the transaction.
   * @returns The result of the function.
   * @throws If the function throws an error, the transaction will be rolled back and the error rethrown.
   */
  async runInTransaction<T>(
    fn: (queryRunner: QueryRunner) => Promise<T>
  ): Promise<T> {
    const existingQueryRunner = this.asyncLocalStorage.getStore();

    // Check if a queryRunner has already been created for this context to allow for nesting
    if (existingQueryRunner) {
      console.log(existingQueryRunner.id);
      console.log("There's an existing queryRunner");
      return fn(existingQueryRunner.queryRunner);
    }

    // Create a new queryRunner for this context
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const id = uuid();
    console.log(id);
    this.asyncLocalStorage.enterWith({queryRunner: queryRunner, id: id});

    try {
      const result = await fn(queryRunner);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
