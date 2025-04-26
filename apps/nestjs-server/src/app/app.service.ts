import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { DeviceRepositoryService } from './entities/device/device-repository.service';
import { LogRepositoryService } from './entities/log/log-repository.service';
import { Transactional } from '@org/nestjs-typeorm-transactional';
import { MQTTService } from '@org/buffered-mqtt-adapter';

import { v4 } from 'uuid';
import { setTimeout } from 'timers/promises';

@Injectable()
export class AppService implements OnModuleInit {
  private counter = 0;

  constructor(
    private readonly deviceRepo: DeviceRepositoryService,
    private readonly logRepo: LogRepositoryService,
    private readonly mqttService: MQTTService
  ) { }
  
  async onModuleInit() {
    await this.mqttService.init()
  //   setInterval(() => {
  //     console.log("Counter: ", this.counter);
  //     this.mqttService.publish("apps/nestjs-server/counter", String(this.counter), 0, false, true);
  //     this.counter++;
  // }, 100)
  }

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
    await setTimeout(7500);
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
