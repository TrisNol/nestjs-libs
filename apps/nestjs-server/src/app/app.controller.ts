import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';

import { v4 } from 'uuid';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { AsyncContextual } from '@org/contextual-logging';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Get()
  getData() {
    Logger.debug("@Get() getData() called", AppController.name);
    return this.appService.getData();
  }

  @Get("test")
  getTest() {
    Logger.debug("@Get() test() called", AppController.name);
    return this.appService.test();
  }

  @Get("test/faulty")
  async getFaulty() {
    this.eventEmitter.emit("test", "test");
    Logger.debug("@Get() getFaulty() called", AppController.name);
    const myID = v4();
    try {
      return await this.appService.faulty(myID);
    } catch (e) {
      Logger.error(e);
      // Error was thrown, check that rollback was successful
      const [device] = await Promise.all([
        this.appService.getById(myID)
      ]);
      if (device) {
        Logger.debug("Rollback failed")
        return "Rollback failed";
      } else {
        Logger.debug("Rollback successful")
        return "Rollback successful";
      }
    }
  }

  @OnEvent("test")
  @AsyncContextual()
  onTest(data: string) {
    Logger.warn("@OnEvent() onTest() called", AppController.name);
    Logger.warn(data);
  }
}
