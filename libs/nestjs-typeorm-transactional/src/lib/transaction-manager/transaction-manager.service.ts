import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class TransactionManager implements OnModuleInit {
    private asyncLocalStorage = new AsyncLocalStorage<QueryRunner>();

    constructor(private readonly dataSource: DataSource) { }

    onModuleInit() {
        this.asyncLocalStorage = new AsyncLocalStorage<QueryRunner>();
    }

    /**
     * Executes the given function within a transaction context.
     * @param fn The function to execute within the transaction.
     * @returns The result of the function.
     * @throws If the function throws an error, the transaction will be rolled back and the error rethrown.
     */
    async runInTransaction<T>(fn: (queryRunner: QueryRunner) => Promise<T>): Promise<T> {
        const existingQueryRunner = this.asyncLocalStorage.getStore();

        // Check if a queryRunner has already been created for this context to allow for nesting
        if (existingQueryRunner) {
            return fn(existingQueryRunner);
        }

        // Create a new queryRunner for this context
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

