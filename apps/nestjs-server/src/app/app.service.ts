import { Injectable } from '@nestjs/common';

import { DeviceRepositoryService } from './entities/device/device-repository.service';
import { LogRepositoryService } from './entities/log/log-repository.service';

@Injectable()
export class AppService {
  constructor(
    private readonly deviceRepo: DeviceRepositoryService,
    private readonly logRepo: LogRepositoryService
  ) {}

  getData() {
    return this.deviceRepo.findAll();
  }

  async test(numOfLogs: number = 42) {
    const device = await this.deviceRepo.create({
      id: undefined,
      serialNumber: '1234567890',
      logs: []
    });
    for (let i = 0; i < numOfLogs; i++) {
      await this.logRepo.create({
        id: undefined,
        deviceId: device.id,
        device: device,
        timestamp: new Date(),
        severity: 'INFO',
        message: 'Test log message'
      });      
    }
  }

  testTransactional(numOfLogs: number = 42) {

  }

  reset() {
    this.deviceRepo.deleteAll();
  }
} 
