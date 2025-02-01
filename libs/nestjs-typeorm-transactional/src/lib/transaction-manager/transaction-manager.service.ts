import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class TransactionManager implements OnModuleInit {
    private asyncLocalStorage = new AsyncLocalStorage<QueryRunner>();

    constructor(private readonly dataSource: DataSource) { }

    onModuleInit() {
        // Ensure async storage is ready to use
        this.asyncLocalStorage = new AsyncLocalStorage<QueryRunner>();
    }

    /**
     * Executes the given function within a transaction context.
     * @param fn The function to execute within the transaction.
     */
    async runInTransaction<T>(fn: (queryRunner: QueryRunner) => Promise<T>): Promise<T> {
        const existingQueryRunner = this.asyncLocalStorage.getStore();

        // If there's an existing query runner, use it for nesting
        if (existingQueryRunner) {
            return fn(existingQueryRunner);
        }

        // Otherwise, create a new transaction
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        this.asyncLocalStorage.enterWith(queryRunner);

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

