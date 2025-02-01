# nestjs-typeorm-transactional

This library enhances the use of TypeORM within NestJS applications by providing a straightforward way to manage database transactions. By running TypeORM calls, such as CRUD operations, within transactions, you can ensure data integrity and consistency. This approach helps to:

- Automatically rollback changes in case of errors, preventing partial updates.
- Maintain atomicity, ensuring that a series of operations either all succeed or all fail.
- Simplify complex operations that involve multiple database interactions.
- Improve error handling and recovery processes.

Using transactions can significantly reduce the risk of data corruption and make your application more robust and reliable.

## Usage

1. Install the lib.
2. Register the `NestJSTypeormTransactionalModule` in your `AppModule`:

    ```ts
    import { NestJSTypeormTransactionalModule } from '@org/nestjs-typeorm-transactional';

    @Module({
    imports: [
        TypeOrmModule.forRoot({
            /**Connection settings**/
        }),
        /**other imports**/
        NestJSTypeormTransactionalModule
    ],
    controllers: [],
    providers: [],
    })
    export class AppModule {}
    ```
3. Apply the `Transactional()` decorator where required; e.g.:

    ```ts
    @Transactional() // 👈 That's all you need to do
    async faulty(id: string) {
        const device = await this.deviceRepo.create({
        id: id,
        serialNumber: v4(),
        logs: []
        });
        Logger.log(`Created device with serial number ${device.serialNumber} & id ${device.id}`);
        for (let i = 0; i < 69; i++) {
            const log = await this.logRepo.create({
                id: undefined,
                deviceId: device.id,
                device: device,
                timestamp: new Date(),
                severity: 'INFO',
                message: 'Test log message'
            });
            if (i === 21) {
                /* 
                This will trigger the Transactional() decorator
                and rollback the previous changes to the DB
                */
                throw new Error('Test error');
            }
        }
    }
    ```
    > [!IMPORTANT]  
    > Make sure that the `NestJSTypeormTransactionalModule` is available within the scope of the functions annoated with the `Transactional()` decorator
