import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Equal, Repository } from "typeorm";
import { LogEntity } from "./log.entity";
import { Transactional } from "@org/nestjs-typeorm-transactional";

@Injectable()
export class LogRepositoryService {
    constructor(
        @InjectRepository(LogEntity)
        private readonly logRepository: Repository<LogEntity>
    ) {
    }

    async findAll(): Promise<LogEntity[]> {
        return this.logRepository.find();
    }

    async findLogsOfDevice(deviceId: string): Promise<LogEntity[]> {
        return this.logRepository.find({ where: { deviceId: Equal(deviceId) } });
    }

    async create(log: LogEntity): Promise<LogEntity> {
        return this.logRepository.save(log);
    }

    async delete(id: string): Promise<void> {
        await this.logRepository.delete(id);
    }
}