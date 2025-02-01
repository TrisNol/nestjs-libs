import { Transactional } from './transactional.decorator';
import { TransactionManager } from './transaction-manager/transaction-manager.service';
import { QueryRunner } from 'typeorm';

describe('Transactional Decorator', () => {
    let transactionManager: TransactionManager;
    let queryRunner: QueryRunner;

    beforeEach(() => {
        transactionManager = {
            runInTransaction: jest.fn().mockImplementation((fn) => fn(queryRunner)),
        } as any;
        queryRunner = {
            manager: {},
        } as any;
    });

    it('should inject TransactionManager and run method in transaction', async () => {
        class TestService {
            transactionManager = transactionManager;

            @Transactional()
            async testMethod(arg: any) {
                return 'result';
            }
        }

        const service = new TestService();
        const result = await service.testMethod({ manager: {} });

        expect(transactionManager.runInTransaction).toHaveBeenCalled();
        expect(result).toBe('result');
    });

    it('should bind queryRunner manager to method arguments', async () => {
        class TestService {
            transactionManager = transactionManager;

            @Transactional()
            async testMethod(arg: any) {
                return arg.manager;
            }
        }

        const service = new TestService();
        const result = await service.testMethod({ manager: {} });

        expect(result).toBe(queryRunner.manager);
    });
});
