import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, QueryRunner } from 'typeorm';
import { TransactionManager } from './transaction-manager.service';
import { AsyncLocalStorage } from 'async_hooks';

describe(TransactionManager.name, () => {
    let service: TransactionManager;
    let dataSource: DataSource;
    let queryRunner: QueryRunner;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TransactionManager,
                {
                    provide: DataSource,
                    useValue: {
                        createQueryRunner: jest.fn().mockReturnValue({
                            connect: jest.fn(),
                            startTransaction: jest.fn(),
                            commitTransaction: jest.fn(),
                            rollbackTransaction: jest.fn(),
                            release: jest.fn(),
                        }),
                    },
                },
            ],
        }).compile();

        service = module.get<TransactionManager>(TransactionManager);
        dataSource = module.get<DataSource>(DataSource);
        queryRunner = dataSource.createQueryRunner();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('onModuleInit', () => {
        it('should initialize asyncLocalStorage', () => {
            service.onModuleInit();

            expect(service['asyncLocalStorage']).toBeInstanceOf(AsyncLocalStorage);
        });
    });

    describe('runInTransaction', () => {
        it('should run function within a transaction', async () => {
            const fn = jest.fn().mockResolvedValue('result');
            const result = await service.runInTransaction(fn);

            expect(queryRunner.connect).toHaveBeenCalled();
            expect(queryRunner.startTransaction).toHaveBeenCalled();
            expect(fn).toHaveBeenCalledWith(queryRunner);
            expect(queryRunner.commitTransaction).toHaveBeenCalled();
            expect(queryRunner.release).toHaveBeenCalled();
            expect(result).toBe('result');
        });

        it('should rollback transaction if function throws an error', async () => {
            const fn = jest.fn().mockRejectedValue(new Error('test error'));

            await expect(service.runInTransaction(fn)).rejects.toThrow('test error');

            expect(queryRunner.connect).toHaveBeenCalled();
            expect(queryRunner.startTransaction).toHaveBeenCalled();
            expect(fn).toHaveBeenCalledWith(queryRunner);
            expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
            expect(queryRunner.release).toHaveBeenCalled();
        });
    });
});

