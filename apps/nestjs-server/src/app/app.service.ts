import { Injectable, Logger } from '@nestjs/common';

import { DeviceRepositoryService } from './entities/device/device-repository.service';
import { LogRepositoryService } from './entities/log/log-repository.service';
import { Transactional } from '@org/nestjs-typeorm-transactional';

import { v4 } from 'uuid';

@Injectable()
export class AppService {
  constructor(
    private readonly deviceRepo: DeviceRepositoryService,
    private readonly logRepo: LogRepositoryService
  ) { }

  getById(id: string) {
    return this.deviceRepo.findById(id);
  }

  getData() {
    return this.deviceRepo.findAll();
  }

  async test(numOfLogs = 42) {
    const device = await this.deviceRepo.create({
      id: undefined,
      serialNumber: v4(),
      logs: []
    });
    Logger.log(`Created device with serial number ${device.serialNumber} & id ${device.id}`);
    for (let i = 0; i < numOfLogs; i++) {
      const log = await this.logRepo.create({
        id: undefined,
        deviceId: device.id,
        device: device,
        timestamp: new Date(),
        severity: 'INFO',
        message: 'Test log message'
      });
      Logger.log(`Created log with id ${log.id} for device with serial number ${device.serialNumber}`);
    }
    return "Done";
  }

  @Transactional()
  async faulty(id: string) {
    const device = await this.deviceRepo.create({
      id: id,
      serialNumber: v4(),
      logs: []
    });
    Logger.log(`Created device with serial number ${device.serialNumber} & id ${device.id}`);
    for (let i = 0; i < 69; i++) {
      await this.logRepo.create({
        id: undefined,
        deviceId: device.id,
        device: device,
        timestamp: new Date(),
        severity: 'INFO',
        message: 'Test log message'
      });
      if (i === 21) {
        throw new Error('Test error');
      }
    }
  }

  reset() {
    this.deviceRepo.deleteAll();
  }
} 
