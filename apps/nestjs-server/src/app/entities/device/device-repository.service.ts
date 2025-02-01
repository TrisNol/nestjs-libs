import { Injectable } from "@nestjs/common";
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
        return this.repository.find();
    }

    public async findById(id: string): Promise<DeviceEntity> {
        return this.repository.findOneBy({ id: Equal(id) });
    }

    public async findBySerialNumber(serialNumber: string): Promise<DeviceEntity> {
        return this.repository.findOneBy({ serialNumber: Equal(serialNumber) });
    }

    public async create(device: DeviceEntity): Promise<DeviceEntity> {
        return this.repository.save(device);
    }

    public async update(device: DeviceEntity): Promise<DeviceEntity> {
        return this.repository.save(device);
    }

    public async delete(device: DeviceEntity): Promise<void> {
        await this.repository.remove(device);
    }

    public async deleteById(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    public async deleteAll(): Promise<void> {
        await this.repository.clear();
    }
}