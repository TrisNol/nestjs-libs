import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Equal, Repository } from "typeorm";
import { DeviceEntity } from "./device.entity";
import { Transactional } from "@org/nestjs-typeorm-transactional";

@Injectable()
export class DeviceRepositoryService {
    constructor(
        @InjectRepository(DeviceEntity)
        private readonly repository: Repository<DeviceEntity>
    ) {
    }

    public async findAll(): Promise<DeviceEntity[]> {
        Logger.debug(`findAll called`, DeviceRepositoryService.name);
        return this.repository.find();
    }

    public async findById(id: string): Promise<DeviceEntity> {
        Logger.debug(`findById called`, DeviceRepositoryService.name);
        return this.repository.findOneBy({ id: Equal(id) });
    }

    public async findBySerialNumber(serialNumber: string): Promise<DeviceEntity> {
        Logger.debug(`findBySerialNumber called`, DeviceRepositoryService.name);
        return this.repository.findOneBy({ serialNumber: Equal(serialNumber) });
    }

    @Transactional()
    public async create(device: DeviceEntity): Promise<DeviceEntity> {
        Logger.debug(`create called`, DeviceRepositoryService.name);
        return this.repository.save(device);
    }

    public async update(device: DeviceEntity): Promise<DeviceEntity> {
        Logger.debug(`update called`, DeviceRepositoryService.name);
        return this.repository.save(device);
    }

    public async delete(device: DeviceEntity): Promise<void> {
        Logger.debug(`delete called`, DeviceRepositoryService.name);
        await this.repository.remove(device);
    }

    public async deleteById(id: string): Promise<void> {
        Logger.debug(`deleteById called`, DeviceRepositoryService.name);
        await this.repository.delete(id);
    }

    public async deleteAll(): Promise<void> {
        Logger.debug(`deleteAll called`, DeviceRepositoryService.name);
        await this.repository.clear();
    }
}