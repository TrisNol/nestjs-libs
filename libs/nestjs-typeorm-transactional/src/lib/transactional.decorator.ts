import { Inject } from "@nestjs/common";
import { TransactionManager } from "./transaction-manager/transaction-manager.service";
import { QueryRunner } from "typeorm";

export function Transactional() {
    const injectTransactionManager = Inject(TransactionManager);

    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) {
        injectTransactionManager(target, "transactionManager");
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            return (this as any).transactionManager.runInTransaction(async (queryRunner: QueryRunner) => {
                // Bind the queryRunner to repository calls, if needed
                const boundArgs = args.map((arg) => {
                    if (arg?.manager) {
                        arg.manager = queryRunner.manager;
                    }
                    return arg;
                });
                return originalMethod.apply(this, boundArgs);
            });
        };

        return descriptor;
    };
}