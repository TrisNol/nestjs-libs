import { Module } from "@nestjs/common";
import { DeviceEntity } from "./device/device.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LogEntity } from "./log/log.entity";
import { DeviceRepositoryService } from "./device/device-repository.service";
import { LogRepositoryService } from "./log/log-repository.service";
import { NestJSTypeormTransactionalModule } from "@org/nestjs-typeorm-transactional";

@Module({
    imports: [
        TypeOrmModule.forFeature([DeviceEntity, LogEntity]),
        NestJSTypeormTransactionalModule
    ],
    providers: [
        DeviceRepositoryService,
        LogRepositoryService
    ],
    exports: [
        TypeOrmModule,
        DeviceRepositoryService,
        LogRepositoryService
    ]
})
export class EntitiesModule { }